import { UserResponse, UserRole } from "../../models/user.model";
import bcrypt from 'bcryptjs';

export const testUser: UserResponse = {
  id: 'test-user-id',
  email: 'test@example.com',
  password: bcrypt.hashSync('Password123', 10),
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.CLIENT,
  isActive: true,
  phoneNumber: null,
  profilePicture: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const testProfessional: UserResponse = {
  id: 'test-pro-id',
  email: 'pro@example.com',
  password: bcrypt.hashSync('Password123', 10),
  firstName: 'Pro',
  lastName: 'User',
  role: UserRole.PROFESSIONAL,
  isActive: true,
  phoneNumber: null,
  profilePicture: null,
  createdAt: new Date(),
  updatedAt: new Date()
};
