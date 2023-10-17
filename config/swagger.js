const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Snowy API',
            version: '1.0.0',
            description: 'A simple API for the Snowy Backend',
        },
    },
    apis: ['./routes/*.js'], // Path to your API routes files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
