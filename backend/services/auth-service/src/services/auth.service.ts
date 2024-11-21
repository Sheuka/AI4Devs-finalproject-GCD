import { UserService } from './user.service';
import crypto from 'crypto';
import { AuthenticationError } from '../utils/errors';
import { UserResponse } from '../models/user.model';
import { config } from '../config';

export class AuthService {
  private userService: UserService;
  private static resetTokensMap: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + config.PASSWORD_RESET_TOKEN_EXPIRATION_HOURS); // Token válido por 1 hora

    AuthService.resetTokensMap.set(token, {
      userId,
      expiresAt
    });

    return token;
  }

  async verifyPasswordResetToken(token: string): Promise<UserResponse> {
    const tokenData = AuthService.resetTokensMap.get(token);
    
    if (!tokenData) {
      throw new AuthenticationError('Token inválido');
    }

    if (tokenData.expiresAt < new Date()) {
      this.invalidateResetToken(token);
      throw new AuthenticationError('Token expirado');
    }

    const user = await this.userService.findById(tokenData.userId);
    if (!user) {
      throw new AuthenticationError('Usuario no encontrado');
    }

    return user;
  }

  private invalidateResetToken(token: string): void {
    AuthService.resetTokensMap.delete(token);
  }

  // Método estático para limpiar el resetTokensMap (solo para pruebas)
  static clearResetTokensMap() {
    AuthService.resetTokensMap.clear();
  }
}
