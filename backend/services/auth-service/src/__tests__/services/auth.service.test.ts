import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { testUser } from '../fixtures/users';
import { AuthenticationError } from '../../utils/errors';
import { config } from '../../config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    authService = new AuthService(userService);
    AuthService.clearResetTokensMap();
  });

  describe('generatePasswordResetToken', () => {
    it('debería generar un token válido', async () => {
      const userId = 'test-user-id';
      const token = await authService.generatePasswordResetToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('debería almacenar el token con fecha de expiración correcta', async () => {
      const userId = 'test-user-id';
      const token = await authService.generatePasswordResetToken(userId);
      
      // @ts-ignore - Acceder a la propiedad privada para testing
      const tokenData = AuthService['resetTokensMap'].get(token);
      
      expect(tokenData).toBeDefined();
      expect(tokenData?.userId).toBe(userId);
      
      const expectedExpiration = new Date();
      expectedExpiration.setHours(expectedExpiration.getHours() + config.PASSWORD_RESET_TOKEN_EXPIRATION_HOURS);
      
      // Comparar solo las horas para evitar diferencias de milisegundos
      expect(tokenData?.expiresAt.getHours()).toBe(expectedExpiration.getHours());
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('debería verificar un token válido correctamente', async () => {
      const userId = testUser.id;
      userService.findById.mockResolvedValue(testUser);
      
      const token = await authService.generatePasswordResetToken(userId);
      const user = await authService.verifyPasswordResetToken(token);

      expect(user).toEqual(testUser);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });

    it('debería rechazar un token inválido', async () => {
      await expect(authService.verifyPasswordResetToken('invalid-token'))
        .rejects
        .toThrow(new AuthenticationError('Token inválido'));
    });

    it('debería rechazar un token expirado', async () => {
      const userId = testUser.id;
      userService.findById.mockResolvedValue(testUser);
      
      const token = await authService.generatePasswordResetToken(userId);
      
      // @ts-ignore - Acceder a la propiedad privada para testing
      AuthService['resetTokensMap'].get(token).expiresAt = new Date(Date.now() - 1000);
      
      await expect(authService.verifyPasswordResetToken(token))
        .rejects
        .toThrow(new AuthenticationError('Token expirado'));
    });
  });
});
