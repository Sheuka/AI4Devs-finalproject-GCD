import { UserRole } from '@prisma/client';

export interface CreateProfessionalDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  speciality?: string;
  province?: string;
  locality?: string;
  role?: UserRole;
}

export interface UpdateProfessionalDTO {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  speciality?: string;
  isActive?: boolean;
  province?: string;
  locality?: string;
} 