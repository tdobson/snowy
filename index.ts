import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize } from './models'; // Importing sequelize connection
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';
import mcsRoutes from './routes/mcsRoutes';
import elevationRoutes from './routes/elevationRoutes';

import errorHandler from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger';

const app: express.Application = express();

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
app.use('/api/v1/elevations', elevationRoutes);


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
