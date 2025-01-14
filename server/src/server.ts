import express, { Express } from 'express';
import mongoose from 'mongoose';
import postsController from './controllers/post.controller';
import commentsController from './controllers/comment.controller';
import authenticate from './middlewares/auth.middleware';
import authController from './controllers/auth.controller';
import usersController from './controllers/user.controller';
import { setupSwagger } from './swagger';
import cors from 'cors';
import https, { Server as HttpsServer } from 'https';
import http, { Server as HttpServer } from 'http';
import fs from 'fs';
import path from 'path';
import { ServerWithPort } from './types/types';
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

const serverPromise: Promise<ServerWithPort> = new Promise(
  (resolve, reject) => {
    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log('Connected to MongoDB');
        const app: Express = express();

        app.use(cors());
        setupSwagger(app);
        app.use(express.json());
        app.use(authenticate);
        app.use('/auth', authController);
        app.use('/posts', postsController);
        app.use('/comments', commentsController);
        app.use('/users', usersController);

        if (process.env.NODE_ENV === 'production') {
          console.log('Production mode');
          const server: HttpsServer = https.createServer(
            {
              key: privateKey,
              cert: certificate,
            },
            app
          );

          resolve({ server, port: Number(process.env.HTTPS_PORT) });
        } else {
          console.log('Development mode');
          const server: HttpServer = http.createServer(app);
          resolve({ server, port: Number(process.env.HTTP_PORT) });
        }
      })
      .catch((err) => console.error(err));
  }
);

export default serverPromise;
