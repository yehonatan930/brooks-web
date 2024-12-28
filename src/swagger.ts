const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API Documentation',
            version: '1.0.0',
            description: 'This is the Swagger documentation for the User API endpoints.',
        },
        servers: [
            {
                url: 'http://localhost:8080/api',
            },
        ],
    },
    apis: ['src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

