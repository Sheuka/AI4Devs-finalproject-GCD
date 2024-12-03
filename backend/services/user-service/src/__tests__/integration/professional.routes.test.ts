import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { generateTestToken } from '../setup';
import { responseUser } from '../fixtures/users';
import * as dependencies from '../../config/dependencies';
import { ProfessionalService } from '../../services/professional.service';

jest.mock('@prisma/client');

describe('Professional Routes', () => {
  let server: any;
  let prismaClient: jest.Mocked<PrismaClient>;
  let professionalService: ProfessionalService;

  beforeAll(() => {
    jest.clearAllMocks();

    prismaClient = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    (PrismaClient as jest.Mock).mockImplementation(() => prismaClient);
  });

  beforeEach(() => {
    dependencies.setPrismaClient(prismaClient);
    professionalService = new ProfessionalService();
    dependencies.setProfessionalService(professionalService);

    if (!server) {
      server = app.listen(4002);
    }
  });

  afterAll(() => {
    server?.close();
  });

  describe('GET /api/professionals', () => {
    it('debería obtener una lista de profesionales', async () => {
      (prismaClient.user.findMany as jest.Mock).mockResolvedValue([responseUser]);
      const token = generateTestToken(responseUser.id, 'PROFESSIONAL');

      const response = await request(app)
        .get('/api/professionals')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([responseUser]);
    });

    it('debería retornar 401 sin token', async () => {
      const response = await request(app).get('/api/professionals');
      expect(response.status).toBe(401);
    });
  });
}); 