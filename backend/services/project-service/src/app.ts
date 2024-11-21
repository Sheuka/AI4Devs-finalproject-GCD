import express from 'express';
import projectRoutes from './routes/projectRoutes';
import quoteRoutes from './routes/quoteRoutes';
import errorMiddleware from './middlewares/error.middleware';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(express.json());

// Configurar CORS si es necesario
app.use(cors());

// Limitar solicitudes para prevenir ataques de fuerza bruta
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limitar a 100 solicitudes por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
});

app.use(limiter);

// Rutas
app.use('/projects', projectRoutes);
app.use('/quotes', quoteRoutes);

// Ruta de prueba
app.get('/', async (_req, res) => {
    res.send('Servicio de Proyectos y Presupuestos Activo');
});

// Middleware de manejo de errores
app.use(errorMiddleware);

export default app;