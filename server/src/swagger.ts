import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API Documentation',
      version: '1.0.0',
      description:
        'This is the Swagger documentation for the User API endpoints.',
    },
    servers: [
      {
        url: 'http://localhost:80/api',
      },
    ],
  },
  apis: ['src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
