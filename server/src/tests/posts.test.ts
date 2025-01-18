import request from 'supertest';
import { Server as HttpServer } from 'http';
import mongoose from 'mongoose';
import { IPost } from '../schemas/post.schema';
import serverPromise from '../server';

describe('posts tests', () => {
  let app: HttpServer;

  let postSender: string;
  let accessToken: string;
  const email = `${Math.floor(Math.random() * 1000)}@yeah`;

  beforeAll(async () => {
    app = (await serverPromise).server;

    const res = await request(app).post('/auth/register').send({
      email,
      username: 'test user',
      password: 'password',
    });

    postSender = res.body._id;
  });

  async function login() {
    const res = await request(app).post('/auth/login').send({
      email,
      password: 'password',
    });

    accessToken = res.body.accessToken;
  }

  beforeEach(async () => {
    await login();
  });

  afterAll(async () => {
    await request(app).delete(`/users/${postSender}`);
    await mongoose.connection.close();
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPost: IPost = {
        userId: postSender,
        bookTitle: 'Hello, World!',
        content: 'This is a test post',
      } as IPost;

      const response = await request(app)
        .post('/posts')
        .send(newPost)
        .set('Accept', 'application/json')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(newPost.userId);
      expect(response.body.bookTitle).toBe(newPost.bookTitle);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body._id).toBeDefined();
    });
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((post: IPost) => {
        expect(post._id).toBeDefined();
        expect(post.userId).toBeDefined();
        expect(post.bookTitle).toBeDefined();
        expect(post.content).toBeDefined();
      });
    });

    it('should return posts by userId', async () => {
      const response = await request(app)
        .get(`/posts?userId=${postSender}`)
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((post: IPost) => {
        expect(post._id).toBeDefined();
        expect(post.userId).toBe(postSender);
        expect(post.bookTitle).toBeDefined();
        expect(post.content).toBeDefined();
      });
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a post by id', async () => {
      const posts = await request(app)
        .get('/posts')
        .set('Authorization', `JWT ${accessToken}`);

      const postId = posts.body[0]._id;
      const response = await request(app)
        .get(`/posts/${postId}`)
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(postId);
    });

    it('should return 404 if post not found', async () => {
      const response = await request(app)
        .get('/posts/1234567890')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /posts', () => {
    it('should update a post', async () => {
      const posts = await request(app)
        .get('/posts')
        .set('Authorization', `JWT ${accessToken}`);
      const postId = posts.body[0]._id;
      const updatedPost: IPost = {
        _id: postId,
        userId: postSender,
        bookTitle: 'Hello, World!',
        content: 'This is an updated test post',
      } as IPost;

      const response = await request(app)
        .put('/posts')
        .send(updatedPost)
        .set('Accept', 'application/json')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(201);
      expect(response.body._id).toBe(postId);
      expect(response.body.userId).toBe(updatedPost.userId);
      expect(response.body.bookTitle).toBe(updatedPost.bookTitle);
      expect(response.body.content).toBe(updatedPost.content);
    });

    it('should return 404 if post not found', async () => {
      const updatedPost: IPost = {
        _id: new mongoose.Schema.Types.ObjectId(''),
        userId: postSender,
        bookTitle: 'Hello, World!',
        content: 'This is an updated test post',
      } as IPost;

      const response = await request(app)
        .put('/posts')
        .send(updatedPost)
        .set('Accept', 'application/json')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });
});
