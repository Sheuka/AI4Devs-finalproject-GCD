import { UserRole } from "@prisma/client";

export interface UserBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends UserBase {
  password: string;
  isActive: boolean;
  lastLogin?: Date;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserResponseDTO extends Omit<UserBase, 'password'> {
  isActive: boolean;
}
