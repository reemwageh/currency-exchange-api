// Import swagger-jsdoc to generate API documentation
const swaggerJsDoc = require('swagger-jsdoc');
// Define options for Swagger documentation 
const options = {
// Define the OpenAPI specification version and general information about the API
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Currency Exchange API',
      version: '1.0.0',
      description: 'API for currency exchange rates',
    },
  },
// Specify the location of the route files for API documentation
  apis: ['./src/routes/*.js'], 
};
// Generate and export Swagger documentation
const swaggerDocs = swaggerJsDoc(options);
module.exports = swaggerDocs;
