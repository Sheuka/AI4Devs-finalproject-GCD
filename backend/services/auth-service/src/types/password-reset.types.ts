export interface PasswordResetCreateDTO {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface PasswordResetVerifyDTO {
  token: string;
}

export interface PasswordResetResponseDTO {
  message: string;
  success: boolean;
}

export interface PasswordResetTokenData {
  userId: string;
  expiresAt: Date;
}

export interface PasswordResetCompleteDTO {
  token: string;
  password: string;
}

export interface PasswordChangeDTO {
  currentPassword: string;
  password: string;
}
