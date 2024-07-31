import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Snowy API',
            version: '1.0.0',
            description: 'A simple API for the Snowy Backend',
        },
    },
    apis: ['./routes/*.ts'], // Updated to look for TypeScript files
};

const specs = swaggerJsdoc(options);

export default specs;
