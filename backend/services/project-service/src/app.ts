import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('¡Proyecto Project-Service funcionando!');
});

app.listen(PORT, () => {
    console.log(\Servidor corriendo en el puerto \\);
});
