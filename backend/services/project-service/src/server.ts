import app from './app';
import { getPrismaClient } from './config/dependencies';
import { config } from './config';
import dotenv from 'dotenv';

dotenv.config();

const prisma = getPrismaClient();

const startServer = async () => {
    try {
        // Inicializar Prisma
        await prisma.$connect();
        console.log('Conexión a la base de datos exitosa');

        // Iniciar el servidor
        const port = config.PORT || 4000;
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
