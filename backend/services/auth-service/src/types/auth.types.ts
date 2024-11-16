import { UserRole } from "@prisma/client";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

export interface ResetTokenData {
  userId: string;
  expiresAt: Date;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  };
}

export interface PasswordResetRequestDTO {
  email: string;
}

export interface PasswordResetResponseDTO {
  message: string;
  expiresIn: number;
}

export interface PasswordResetVerifyDTO {
  token: string;
}

export interface PasswordResetCompleteDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetStatusDTO {
  id: string;
  status: 'pending' | 'used' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}
