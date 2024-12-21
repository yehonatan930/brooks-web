import request from "supertest";
import serverPromise from "../src/server";
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
      .send({ email: userEmail, password: userPassword });
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
});

describe("refresh token", () => {
  it("should refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Authorization", `JWT ${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });
});
