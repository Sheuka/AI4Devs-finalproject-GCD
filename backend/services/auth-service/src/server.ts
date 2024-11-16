import app from './app';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { config } from './config';

dotenv.config();

const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Inicializar Prisma
    await prisma.$connect();
    console.log('Conexión a la base de datos exitosa');

    // Start server
    const port = config.PORT || 3001;
    app.listen(port, () => {
      console.log(`Auth service running on port ${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
