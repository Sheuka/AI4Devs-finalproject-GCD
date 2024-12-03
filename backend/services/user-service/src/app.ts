import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes';
import professionalRoutes from './routes/professional.routes';
import errorHandler from './middlewares/error.middleware';

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
