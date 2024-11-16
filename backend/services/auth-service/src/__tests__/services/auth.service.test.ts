import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { testUser } from '../fixtures/users';
import { AuthenticationError } from '../../utils/errors';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    // Crear un mock de UserService
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      updatePassword: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    // Instanciar AuthService con el UserService mockeado
    authService = new AuthService(userService);
  });

  describe('login', () => {
    it('debería autenticar un usuario con credenciales válidas', async () => {
      // Configurar el mock para encontrar el usuario
      userService.findByEmail.mockResolvedValue({
        id: 'user123',
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: UserRole.CLIENT,
        isActive: true,
        phoneNumber: null,
        profilePicture: null,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.login(testUser.email, testUser.password);

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', testUser.email);
      expect(result.user).not.toHaveProperty('password');
      expect(userService.findByEmail).toHaveBeenCalledWith(testUser.email);
    });

    it('debería fallar con credenciales inválidas', async () => {
      // Configurar el mock para que no encuentre el usuario
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login(testUser.email, 'wrongpass')
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      // Configurar el mock para que no exista el usuario
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue({
        id: 'user123',
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: UserRole.CLIENT,
        isActive: true,
        phoneNumber: null,
        profilePicture: null,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register(testUser as any);

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', testUser.email);
      expect(result.user).not.toHaveProperty('password');
      expect(userService.findByEmail).toHaveBeenCalledWith(testUser.email);
      expect(userService.create).toHaveBeenCalled();
    });

    it('debería fallar si el email ya está registrado', async () => {
      // Configurar el mock para que el usuario ya exista
      userService.findByEmail.mockResolvedValue({
        id: 'user123',
        email: testUser.email,
        password: 'hashedpassword',
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: UserRole.CLIENT,
        isActive: true,
        phoneNumber: null,
        profilePicture: null,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.register(testUser as any)
      ).rejects.toThrow('El email ya está registrado');
    });
  });
});
