import { prisma } from '../lib/prisma';
import { User } from '@prisma/client';
import { DatabaseError } from '../utils/errors';

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new DatabaseError('Error al buscar usuario por email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new DatabaseError('Error al buscar usuario por ID');
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      throw new DatabaseError('Error al crear usuario');
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
    } catch (error) {
      throw new DatabaseError('Error al actualizar contraseña');
    }
  }
}
