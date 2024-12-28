import request from "supertest";
import serverPromise from "../server";
import { Express } from "express";
import mongoose from "mongoose";

let app: Express;

beforeAll(async () => {
  app = await serverPromise;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("restrict access without token", () => {
  it("should return 401", async () => {
    const response = await request(app).get("/posts");
    expect(response.status).toBe(401);
  });
});

describe("restrict access with invalid token", () => {
  it("should return 401", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", "JWT invalidtoken");
    expect(response.status).toBe(401);
  });
});

const userEmail = "email@bobo.com";
const userPassword = "password";

describe("register user", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "username", email: userEmail, password: userPassword });
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userEmail);
  });
});

let accessToken: string;
let refreshToken: string;

describe("login user", () => {
  it("should login a user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: userEmail, password: userPassword });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  it("should not login a user with invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: userEmail, password: "wrongpassword" });
    expect(response.status).toBe(400);
  });

  it("should not login a user with missing credentials", async () => {
    const response = await request(app).post("/auth/login");
    expect(response.status).toBe(400);
  });

  it("should not login a user that does not exist", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "nono", password: "nono" });
    expect(response.status).toBe(404);
  });
});

describe("get posts with timed out token", () => {
  it("should not get all posts with timed out token", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(401);
  });
});

describe("refresh token", () => {
  it("should refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Authorization", `JWT ${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();

    accessToken = response.body.accessToken;
  });

  it("should not refresh token with invalid token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Authorization", "JWT invalidtoken");
    expect(response.status).toBe(401);
  });

  it("should not refresh token without token", async () => {
    const response = await request(app).post("/auth/refresh");
    expect(response.status).toBe(401);
  });
});

describe("get posts", () => {
  it("should get all posts using access token", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
  });
});

describe("logout user", () => {
  it("should logout a user", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
  });
});

describe("get posts after logout", () => {
  it("should not get all posts after logout", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(401);
  });
});
