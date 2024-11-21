import { PrismaClient } from '@prisma/client';
import { UserService } from '../../services/user.service';
import { DatabaseError } from '../../utils/errors';
import { responseUser, testCreateUser, testUpdateUser } from '../fixtures/users';
import * as dependencies from '../../config/dependencies';
// Mock PrismaClient
jest.mock('@prisma/client');

describe('UserService', () => {
  let userService: UserService;
  let prismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    prismaClient = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    (PrismaClient as jest.Mock).mockImplementation(() => prismaClient);
    dependencies.setPrismaClient(prismaClient);
    userService = new UserService();
  });

  describe('findByEmail', () => {
    it('debería encontrar un usuario por email', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(responseUser);
      
      const result = await userService.findByEmail(testCreateUser.email);
      
      expect(result).toEqual(responseUser);
      expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: responseUser.email }
      });
    });

    it('debería retornar null si no encuentra el usuario', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      const result = await userService.findByEmail('noexiste@example.com');
      
      expect(result).toBeNull();
    });

    it('debería manejar errores de base de datos', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB Error'));
      
      await expect(userService.findByEmail(testCreateUser.email))
        .rejects
        .toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('debería crear un nuevo usuario', async () => {
      (prismaClient.user.create as jest.Mock).mockResolvedValue(responseUser);
      
      const result = await userService.create(testCreateUser);
      
      expect(result).toEqual(responseUser);
      expect(prismaClient.user.create).toHaveBeenCalled();
    });

    it('debería manejar errores de creación', async () => {
      (prismaClient.user.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
      
      await expect(userService.create(testCreateUser)).rejects.toThrow(DatabaseError);
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario existente', async () => {
      const userToUpdate = { ...testUpdateUser, firstName: 'Updated' };
      const updatedUser = { ...responseUser, firstName: 'Updated' };
      const cleanedData = Object.fromEntries(
        Object.entries(userToUpdate).filter(([_, value]) => value !== null)
      );
      (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);
      
      const result = await userService.update(responseUser.id, userToUpdate);
      
      expect(result).toEqual(updatedUser);
      expect(prismaClient.user.update).toHaveBeenCalledWith({
        where: { id: responseUser.id },
        data: cleanedData
      });
    });

    it('debería manejar errores de actualización', async () => {
      (prismaClient.user.update as jest.Mock).mockRejectedValue(new Error('DB Error'));
      
      await expect(userService.update(responseUser.id, testUpdateUser))
        .rejects
        .toThrow(DatabaseError);
    });
  });
});
