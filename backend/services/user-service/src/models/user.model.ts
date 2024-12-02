import { User } from "@prisma/client";

export interface CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  province?: string;
  locality?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  isActive?: boolean | null;
  province?: string;
  locality?: string;
}

export interface UserWithRating extends User {
  rating: number;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN',
}
