import { PrismaClient, User } from '@prisma/client';
import { CreateProfessionalDTO, UpdateProfessionalDTO } from '../models/professional.model';
import { DatabaseError } from '../utils/errors';
import { getPrismaClient } from '../config/dependencies';

export class ProfessionalService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        where: { role: 'PROFESSIONAL' },
      });
    } catch (error) {
      throw new DatabaseError('Error al obtener los profesionales');
    }
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateProfessionalDTO): Promise<User> {
    try {
      data.role = 'PROFESSIONAL';
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      throw new DatabaseError('Error al crear el profesional');
    }
  }

  async update(id: string, data: UpdateProfessionalDTO): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new DatabaseError('Error al actualizar el profesional');
    }
  }

  async toggleStatus(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return await this.prisma.user.update({
        where: { id },
        data: { isActive: !user.isActive },
      });
    } catch (error) {
      throw new DatabaseError('Error al cambiar el estado del profesional');
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError('Error al eliminar el profesional');
    }
  }
} 