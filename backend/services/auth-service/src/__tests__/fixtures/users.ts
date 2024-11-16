import { UserRole } from "@prisma/client";

export const testUser = {
  email: 'test@example.com',
  password: 'Password123',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.CLIENT
};

export const testProfessional = {
  email: 'pro@example.com',
  password: 'Password123',
  firstName: 'Pro',
  lastName: 'User',
  role: UserRole.PROFESSIONAL
};
