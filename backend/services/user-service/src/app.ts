import express from 'express';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes';
import errorHandler from './middlewares/error.middleware';

config();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
