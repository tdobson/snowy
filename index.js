const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models'); // Importing sequelize connection
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');


const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');


const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);


// API Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

// Connection to the database and then starting the server
const PORT = process.env.PORT || 3000;
sequelize.sync() // If you want to automatically create tables based on your models, you can add { force: true } inside sync(). However, this will also drop existing tables.
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.log('Error connecting to the database', err);
    });
