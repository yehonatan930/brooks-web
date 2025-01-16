import dotenv from 'dotenv';
import serverPromise from './server';
import { ServerWithPort } from './types/types';
dotenv.config();

serverPromise.then(({ server, port }: ServerWithPort) => {
  server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}/api`);
    console.log(`Client is running on https://localhost:${port}`);
  });
});
