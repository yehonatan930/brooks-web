import request from "supertest";
import { Express } from "express";
import mongoose from "mongoose";
import { IPost } from "../src/schemas/post.schema";
import serverPromise from "../src/server";

let app: Express;

let postSender: number;
let accessToken: string;

beforeAll(async () => {
  app = await serverPromise;

  const res = await request(app).post("auth/register").send({
    username: "test user",
    password: "password",
  });

  postSender = res.body._id;
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

describe("POST /posts", () => {
  it("should create a new post", async () => {
    const newPost: IPost = {
      sender: postSender,
      title: "Hello, World!",
      content: "This is a test post",
    };

    const response = await request(app)
      .post("/posts")
      .send(newPost)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    expect(response.body.sender).toBe(newPost.sender);
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.content).toBe(newPost.content);
    expect(response.body._id).toBeDefined();
  });
});

describe("GET /posts", () => {
  it("should return all posts", async () => {
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((post: IPost) => {
      expect(post._id).toBeDefined();
      expect(post.sender).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.content).toBeDefined();
    });
  });

  it("should return posts by sender", async () => {
    const response = await request(app)
      .get(`/posts?sender=${postSender}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((post: IPost) => {
      expect(post._id).toBeDefined();
      expect(post.sender).toBe(postSender);
      expect(post.title).toBeDefined();
      expect(post.content).toBeDefined();
    });
  });
});

describe("GET /posts/:id", () => {
  it("should return a post by id", async () => {
    const posts = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    const postId = posts.body[0]._id;
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  it("should return 404 if post not found", async () => {
    const response = await request(app).get("/posts/1234567890");
    expect(response.status).toBe(404);
  });
});

describe("PUT /posts", () => {
  it("should update a post", async () => {
    const posts = await request(app)
      .get("/posts")
      .set("Authorization", `JWT ${accessToken}`);
    const postId = posts.body[0]._id;
    const updatedPost: IPost = {
      _id: postId,
      sender: postSender,
      title: "Hello, World!",
      content: "This is an updated test post",
    };

    const response = await request(app)
      .put("/posts")
      .send(updatedPost)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    expect(response.body._id).toBe(postId);
    expect(response.body.sender).toBe(updatedPost.sender);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.content).toBe(updatedPost.content);
  });

  it("should return 404 if post not found", async () => {
    const updatedPost: IPost = {
      _id: 1234567890,
      sender: postSender,
      title: "Hello, World!",
      content: "This is an updated test post",
    };

    const response = await request(app)
      .put("/posts")
      .send(updatedPost)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(404);
  });
});