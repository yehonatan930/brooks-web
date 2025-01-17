import express, { Express } from 'express';
import mongoose from 'mongoose';
import postsController from './controllers/post.controller';
import commentsController from './controllers/comment.controller';
import authenticate from './middlewares/auth.middleware';
import authController from './controllers/auth.controller';
import usersController from './controllers/user.controller';
import { swaggerSpec } from './swagger';
import cors from 'cors';
import https, { Server as HttpsServer } from 'https';
import http, { Server as HttpServer } from 'http';
import fs from 'fs';
import path from 'path';
import { ServerInfo } from './types/types';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

let privateKey: string, certificate: string;
try {
  privateKey = fs.readFileSync(
    path.join(__dirname, '../cert/client-key.pem'),
    'utf8'
  );
  certificate = fs.readFileSync(
    path.join(__dirname, '../cert/client-cert.pem'),
    'utf8'
  );
} catch (error) {
  console.error('Error reading certificate files:', error);
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;

const serverPromise: Promise<ServerInfo> = new Promise((resolve, reject) => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Connected to MongoDB');
      const app: Express = express();

      const prefix = '/api';

      app.use(cors());
      app.use(express.json());
      app.use(`${prefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      app.use(prefix, authenticate);
      app.use(`${prefix}/auth`, authController);
      app.use(`${prefix}/posts`, postsController);
      app.use(`${prefix}/comments`, commentsController);
      app.use(`${prefix}/users`, usersController);

      // CLIENT -> Serve static files from the build directory
      app.use(express.static(path.join(__dirname, 'build')));

      // CLIENT -> Serve index.html from the build directory for all other routes
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
      });

      if (process.env.NODE_ENV === 'production') {
        console.log('Production mode');
        const server: HttpsServer = https.createServer(
          {
            key: privateKey,
            cert: certificate,
          },
          app
        );

        resolve({
          server,
          port: Number(process.env.HTTPS_PORT),
          link: `https://localhost:${process.env.HTTPS_PORT}`,
        });
      } else {
        console.log('Development mode');
        const server: HttpServer = http.createServer(app);
        resolve({
          server,
          port: Number(process.env.HTTP_PORT),
          link: `http://localhost:${process.env.HTTP_PORT}`,
        });
      }
    })
    .catch((err) => console.error(err));
});

export default serverPromise;
