import { UserRole } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginAttemptCreate {
  userId: string;
  ipAddress: string;
  userAgent: string;
  successful: boolean;
  failureReason?: string;
}

export interface PasswordResetCreate {
  userId: string;
  token: string;
  expiresAt: Date;
}
