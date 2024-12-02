import { User } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO, UserRole } from "../../models/user.model";
import bcrypt from 'bcryptjs';
import { randomUUID } from "crypto";

export const testCreateUser: CreateUserDTO = {
    email: 'test@example.com',
    password: bcrypt.hashSync('Password123', 10),
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CLIENT,    
    phoneNumber: null,
    profilePicture: null,
    province: 'Provincia Ejemplo' || null,
    locality: 'Localidad Ejemplo' || null,
  };

export const testUpdateUser: UpdateUserDTO = {
    password: bcrypt.hashSync('UpdatedPassword123', 10),
    firstName: 'Updated',
    lastName: 'User',
    phoneNumber: null,
    profilePicture: null,
    isActive: true,
    province: 'Nueva Provincia' || null,
    locality: 'Nueva Localidad' || null,
  };
  
export const responseUser: User = {
    ...testCreateUser,
    id:  randomUUID(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    speciality: null,
    province: testCreateUser.province || null,
    locality: testCreateUser.locality || null,
};