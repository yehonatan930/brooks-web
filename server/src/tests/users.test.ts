import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import serverPromise from "../server";
import { IUser } from "../schemas/user.schema";

describe("User tests", () => {
  let app: Express;

  let accessToken: string;

  let userId: string;
  const email = `anEmail@o`;

  beforeAll(async () => {
    app = await serverPromise;

    const res = await request(app).post("/auth/register").send({
      email,
      username: "test user",
      password: "password",
    });

    userId = res.body._id;
  });

  async function login() {
    const res = await request(app).post("/auth/login").send({
      email: "anEmail@o",
      password: "password",
    });

    accessToken = res.body.accessToken;
  }

  beforeEach(async () => {
    await login();
  });

  afterAll(async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);

    await mongoose.connection.close();
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
        .get(`/users/${userId}`)
        .set("Authorization", `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBeDefined();
      expect(response.body.email).toBeDefined();
      expect(response.body.password).toBeDefined();
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user", async () => {
      const updatedUser = {
        username: "Updated User",
        email: "email@email.com",
        password: "updatedpassword",
        tokens: [],
      } as IUser;

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUser)
        .set("Accept", "application/json")
        .set("Authorization", `JWT ${accessToken}`);
      expect(response.status).toBe(201);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.email).toBe(updatedUser.email);
      expect(response.body.password).toBe(updatedUser.password);
      expect(response.body._id).toBe(userId);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user by ID", async () => {
      const response = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);

      const userResponse = await request(app)
        .get(`/users/${userId}`)
        .set("Authorization", `JWT ${accessToken}`);
      expect(userResponse.status).toBe(404);
    });
  });
});
