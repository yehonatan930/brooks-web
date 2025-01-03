import request from "supertest";
import serverPromise from "../server";
import { Express } from "express";
import mongoose from "mongoose";
import { IPost } from "../schemas/post.schema";
import { IComment } from "../schemas/comment.schema";

let app: Express;

let commentAuthor: string;
let accessToken: string;
let postId: string;

const email = `${Math.floor(Math.random() * 1000)}@yeah`;

beforeAll(async () => {
  app = await serverPromise;

  const res = await request(app).post("/auth/register").send({
    email,
    username: "test user",
    password: "password",
  });

  commentAuthor = res.body._id;

  const res2 = await request(app)
    .post("/posts")
    .send({
      title: "Test Post",
      content: "This is a test post",
      sender: commentAuthor,
    } as IPost);

  postId = "6773540ea45a563c1d9cb46c";
});

async function login() {
  const res = await request(app).post("/auth/login").send({
    email,
    password: "password",
  });

  accessToken = res.body.accessToken;
}

beforeEach(async () => {
  await login();
});

afterAll(async () => {
  await request(app).delete(`/users/${commentAuthor}`);
  await mongoose.connection.close();
});

describe("POST /comments", () => {
  it("should create a new comment", async () => {
    const newComment = {
      content: "This is a test comment",
      postId,
      author: commentAuthor,
    };

    const response = await request(app)
      .post("/comments")
      .send(newComment)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(201);
    expect(response.body.content).toBe(newComment.content);
    expect(response.body.postId).toBe(newComment.postId);
    expect(response.body.author).toBe(newComment.author);
    expect(response.body._id).toBeDefined();
  });

  it("should not create a new comment without content", async () => {
    const newComment = {
      postId,
    };

    const response = await request(app)
      .post("/comments")
      .send(newComment)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("sender, content and postId are required");
  });

  it("should not create a new comment without postId", async () => {
    const newComment = {
      content: "This is a test comment",
    };

    const response = await request(app)
      .post("/comments")
      .send(newComment)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("sender, content and postId are required");
  });

  it("should not create a new comment without sender", async () => {
    const newComment = {
      content: "This is a test comment",
      postId,
    };

    const response = await request(app)
      .post("/comments")
      .send(newComment)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("sender, content and postId are required");
  });
});

describe("GET /comments", () => {
  it("should return all comments", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((comment: IComment) => {
      expect(comment._id).toBeDefined();
      expect(comment.author).toBeDefined();
      expect(comment.content).toBeDefined();
    });
  });
});

describe("GET /comments/:postId", () => {
  it("should return all comments with a certain postId", async () => {
    const response = await request(app)
      .get(`/comments/${postId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((comment: IComment) => {
      expect(comment._id).toBeDefined();
      expect(comment.author).toBeDefined();
      expect(comment.content).toBeDefined();
      expect(comment.postId).toBe(postId);
    });
  });
});

describe("PUT /comments/:id", () => {
  it("should update a comment by ID", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", `JWT ${accessToken}`);
    const commentId = response.body[0]._id;

    const updatedComment: IComment = {
      ...response.body[0],
      content: "This is an updated test comment",
    };

    const commentResponse = await request(app)
      .put(`/comments/${commentId}`)
      .send(updatedComment)
      .set("Accept", "application/json")
      .set("Authorization", `JWT ${accessToken}`);
    expect(commentResponse.status).toBe(200);
    expect(commentResponse.body.content).toBe(updatedComment.content);
    expect(commentResponse.body.postId).toBe(updatedComment.postId);
    expect(commentResponse.body.author).toBe(updatedComment.author);
    expect(commentResponse.body._id).toBe(commentId);
  });
});

describe("DELETE /comments/:id", () => {
  it("should delete a comment by ID", async () => {
    const response = await request(app)
      .get("/comments")
      .set("Authorization", `JWT ${accessToken}`);
    const commentId = response.body[0]._id;

    const commentResponse = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `JWT ${accessToken}`);
    expect(commentResponse.status).toBe(200);
    expect(commentResponse.body._id).toBe(commentId);
  });
});
