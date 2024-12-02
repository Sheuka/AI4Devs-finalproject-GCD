import { PrismaClient, User } from '@prisma/client';
import { UpdateUserDTO, CreateUserDTO, UserWithRating } from '../models/user.model';
import { DatabaseError } from '../utils/errors';
import { getPrismaClient, getRatingService } from '../config/dependencies';
import { RatingService } from './ratingService';

export class UserService {
  private prisma: PrismaClient;
  private ratingService: RatingService;

  constructor() {
    this.prisma = getPrismaClient();
    this.ratingService = getRatingService();
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new DatabaseError('Error al buscar usuario por email');
    }
  }

  async findById(id: string): Promise<UserWithRating | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });
      if (user) {
        const rating = await this.ratingService.getAverageRating(id);
        return { ...user, rating };
      }
      return null;
    } catch (error) {
      throw new DatabaseError('Error al buscar usuario por ID');
    }
  }

  async create(userData: CreateUserDTO & { password: string }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: userData
      });
    } catch (error) {
      throw new DatabaseError('Error al crear usuario');
    }
  }

  async update(id: string, updateData: UpdateUserDTO): Promise<User | null> {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null)
      );
      
      return await this.prisma.user.update({
        where: { id },
        data: cleanedData
      });
    } catch (error) {
      throw new DatabaseError('Error al actualizar usuario');
    }
  }
}
