import { getProjectsForProfessional } from '../services/projectService';
import { PrismaClient } from '@prisma/client';
import { setPrismaClient } from '../config/dependencies';

const prisma = new PrismaClient();

beforeAll(async () => {
    setPrismaClient(prisma);
    // Configurar datos de prueba si es necesario
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('getProjectsForProfessional', () => {
    it('debe devolver proyectos en estado open y asignados al profesional', async () => {
        const professionalId = 'test-professional-id';
        const projects = await getProjectsForProfessional(professionalId);
        expect(Array.isArray(projects)).toBe(true);
        // Agrega más aserciones según los datos de prueba
    });
}); 