import { PrismaClient } from '@prisma/client';
import { ProfessionalService } from '../../services/professional.service';
import { DatabaseError } from '../../utils/errors';
import { responseUser } from '../fixtures/users';
import * as dependencies from '../../config/dependencies';

jest.mock('@prisma/client');

describe('ProfessionalService', () => {
  let professionalService: ProfessionalService;
  let prismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
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
    dependencies.setPrismaClient(prismaClient);
    professionalService = new ProfessionalService();
  });

  describe('findAll', () => {
    it('debería retornar una lista de profesionales', async () => {
      (prismaClient.user.findMany as jest.Mock).mockResolvedValue([responseUser]);
      const result = await professionalService.findAll();
      expect(result).toEqual([responseUser]);
      expect(prismaClient.user.findMany).toHaveBeenCalledWith({
        where: { role: 'PROFESSIONAL' },
      });
    });

    it('debería manejar errores de base de datos', async () => {
      (prismaClient.user.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(professionalService.findAll()).rejects.toThrow(DatabaseError);
    });
  });
}); 