const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Opções do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loyfus - IA Search API',
      version: '1.0.0',
      description: 'API para buscar e gerenciar ferramentas de IA.',
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Tool: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            link: { type: 'string' },
            icon: { type: 'string' },
            categories: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['pending', 'approved'] },
          },
        },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};