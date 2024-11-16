import { UserService } from './user.service';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { DatabaseError, AuthenticationError } from '../utils/errors';
import { TokenPayload, LoginResponse } from '../types/auth.types';
import { $Enums, User } from '@prisma/client';
import { 
  PasswordResetCompleteDTO,
  PasswordChangeDTO 
} from '../types/password-reset.types';
import { PasswordUtils } from '../utils/password.utils';

export class AuthService {
  private userService: UserService;
  private static resetTokensMap: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(userData: Partial<User>): Promise<LoginResponse> {
    if (!userData.email || !userData.password) {
      throw new AuthenticationError('El email y la contraseña son requeridos');
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser) {
        throw new AuthenticationError('El email ya está registrado');
      }

      // Encriptar contraseña
      const hashedPassword = await PasswordUtils.hashPassword(userData.password);
      
      // Crear usuario
      const user = await this.userService.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || $Enums.UserRole.CLIENT,
        isActive: true,
        lastLogin: null,
        phoneNumber: userData.phoneNumber || null,
        profilePicture: userData.profilePicture || null
      });

      // Generar token JWT
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError('Error al registrar usuario');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Buscar usuario
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new AuthenticationError('Credenciales inválidas');
      }

      // Verificar contraseña
      const isValidPassword = await PasswordUtils.verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Credenciales inválidas');
      }

      // Generar token JWT
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError('Error al iniciar sesión');
    }
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    AuthService.resetTokensMap.set(token, {
      userId,
      expiresAt
    });

    return token;
  }

  async verifyPasswordResetToken(token: string): Promise<User> {
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

  async resetPassword({ token, password }: PasswordResetCompleteDTO): Promise<void> {
    try {
      const user = await this.verifyPasswordResetToken(token);
      
      // Encriptar nueva contraseña
      const hashedPassword = await PasswordUtils.hashPassword(password);
      
      // Actualizar contraseña
      await this.userService.updatePassword(user.id, hashedPassword);
      
      // Eliminar token usado
      this.invalidateResetToken(token);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError('Error al restablecer la contraseña');
    }
  }

  async changePassword(userId: string, { currentPassword, password }: PasswordChangeDTO): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new AuthenticationError('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isValidPassword = await PasswordUtils.verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Contraseña actual incorrecta');
      }

      // Encriptar nueva contraseña
      const hashedPassword = await PasswordUtils.hashPassword(password);
      
      // Actualizar contraseña
      await this.userService.updatePassword(userId, hashedPassword);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new DatabaseError('Error al cambiar la contraseña');
    }
  }

  private generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new AuthenticationError('Token inválido o expirado');
    }
  }

  private invalidateResetToken(token: string): void {
    AuthService.resetTokensMap.delete(token);
  }

  // Método estático para limpiar el resetTokensMap (solo para pruebas)
  static clearResetTokensMap() {
    AuthService.resetTokensMap.clear();
  }
}
