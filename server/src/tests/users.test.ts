import request from 'supertest';
import { Server as HttpServer } from 'http';
import mongoose from 'mongoose';
import serverPromise from '../server';
import { IUser } from '../schemas/user.schema';

describe('User tests', () => {
  let app: HttpServer;

  let accessToken: string;

  let userId: string;
  const email = `anEmail@o`;

  beforeAll(async () => {
    app = (await serverPromise).server;

    const res = await request(app).post('/auth/register').send({
      email,
      username: 'test user',
      password: 'password',
    });

    userId = res.body._id;
  });

  async function login() {
    const res = await request(app).post('/auth/login').send({
      email: 'yeah@oo',
      password: 'password',
    });

    accessToken = res.body.accessToken;
  }

  beforeEach(async () => {
    await login();
  });

  afterAll(async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(response.status).toBe(200);

    await mongoose.connection.close();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `JWT ${accessToken}`);
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

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const response = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);
      expect(response.body.username).toBeDefined();
      expect(response.body.email).toBeDefined();
      expect(response.body.password).toBeDefined();
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user without a file', async () => {
      const updatedUser = {
        username: 'Updated User',
      } as IUser;

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUser)
        .set('Accept', 'application/json')
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body._id).toBe(userId);
    });

    it('should update a user with a file', async () => {
      const updatedUser = {
        username: 'Updated User',
      } as IUser;

      const response = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `JWT ${accessToken}`)
        .field('username', updatedUser.username)
        .attach('file', `${__dirname}/assets/tiger.jpg`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body._id).toBe(userId);
      expect(response.body.profilePicture.startsWith('/media/')).toBeTruthy();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `JWT ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(userId);

      const userResponse = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `JWT ${accessToken}`);
      expect(userResponse.status).toBe(404);
    });
  });
});
