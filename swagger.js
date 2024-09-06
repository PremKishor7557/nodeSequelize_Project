const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Sample API',
    description: 'API documentation for the sample project.',
  },
  host: 'localhost:3000/users',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/users.js']; // Add the path to your routes

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // You can start your server here or elsewhere
  require('./bin/www'); // Adjust to your server file
});
