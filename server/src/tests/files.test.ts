import { Server as HttpServer } from 'http';
import request from 'supertest';
import serverPromise from '../server';
import mongoose from 'mongoose';

describe('File Tests', () => {
  let app: HttpServer;

  let postSender: string;
  let accessToken: string;
  const email = `${Math.floor(Math.random() * 1000)}@yeah`;

  beforeAll(async () => {
    app = (await serverPromise).server;

    const res = await request(app).post('/api/auth/register').send({
      email,
      username: 'test user',
      password: 'password',
    });

    postSender = res.body._id;
  });

  async function login(customEmail = email) {
    const res = await request(app).post('/api/auth/login').send({
      email: customEmail,
      password: 'password',
    });

    return res.body.accessToken;
  }

  beforeEach(async () => {
    accessToken = await login();
  });

  afterAll(async () => {
    await request(app).delete(`/api/users/${postSender}`);
    await mongoose.connection.close();
  });

  test('upload file', async () => {
    const filePath = `${__dirname}/assets/tiger.jpg`;

    try {
      const response = await request(app)
        .post('/api/files?file=123.jpeg')
        .attach('file', filePath);

      expect(response.statusCode).toEqual(200);

      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, '');
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  });
});
