import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import serverPromise from "../server";
import { IUser } from "../schemas/user.schema";

let app: Express;

let accessToken: string;

beforeAll(async () => {
  app = await serverPromise;
});

async function login() {
  const res = await request(app).post("/auth/login").send({
    username: "test user",
    password: "password",
  });

  accessToken = res.body.accessToken;
}

beforeEach(async () => {
  await login();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /users", () => {
  it("should create a new user", async () => {
    const newUser: IUser = {
      _id: "1",
      username: "Test User",
      email: "example@gamil.com",
      password: "password",
      tokens: [],
    };

    const response = await request(app)
      .post("/users")
      .send(newUser)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBe(newUser.password);
    expect(response.body._id).toBe(newUser._id);
  });
});

describe("GET /users", () => {
  it("should return all users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((user: any) => {
      expect(user._id).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeDefined();
    });
  });
});

describe("GET /users/:id", () => {
  it("should return a user by ID", async () => {
    const response = await request(app)
      .get("/users/1")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(1);
    expect(response.body.username).toBeDefined();
    expect(response.body.email).toBeDefined();
    expect(response.body.password).toBeDefined();
  });
});

describe("PUT /users/:id", () => {
  it("should update a user", async () => {
    const updatedUser: IUser = {
      username: "Updated User",
      email: "email@email.com",
      password: "updatedpassword",
      tokens: [],
    };

    const response = await request(app)
      .put("/users/1")
      .send(updatedUser)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(updatedUser.username);
    expect(response.body.email).toBe(updatedUser.email);
    expect(response.body.password).toBe(updatedUser.password);
    expect(response.body._id).toBe(1);
  });
});

describe("DELETE /users/:id", () => {
  it("should delete a user by ID", async () => {
    const response = await request(app)
      .delete("/users/1")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(1);

    const userResponse = await request(app)
      .get("/users/1")
      .set("Authorization", `JWT ${accessToken}`);
    expect(userResponse.status).toBe(404);
  });
});
