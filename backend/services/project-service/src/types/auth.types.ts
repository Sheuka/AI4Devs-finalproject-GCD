export interface AccessTokenPayload {
  clientId: string;
  iat?: number;
  exp?: number;
}
export interface TokenPayload extends AccessTokenPayload {
  userId: string;
  email: string | null;
  role: UserRole;
}

export enum UserRole {
  CLIENT = "CLIENT",
  PROFESSIONAL = "PROFESSIONAL",
  ADMIN = "ADMIN",
}
