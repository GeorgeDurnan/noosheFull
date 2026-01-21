// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple API',
    },
  },
  apis: ['./routes/*.js'], // <-- point to your route files
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };