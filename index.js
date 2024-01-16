const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models'); // Importing sequelize connection
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const mcsRoutes = require('./routes/mcsRoutes');

const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// API v1 Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mcs', mcsRoutes);

// API Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

// Connection to the database and then starting the server
const PORT = process.env.PORT || 3000;

// Function to sync database
const syncDatabase = async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync();
        } else if (process.env.NODE_ENV === 'production' && process.env.CREATE_TABLES === 'true') {
            await sequelize.sync();
        }
        console.log('Database & tables synced');
    } catch (err) {
        console.error('Error syncing database:', err);
    }
};

syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});