import { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
  clientId: string;
  iat?: number;
  exp?: number;
}
export interface TokenPayload extends AccessTokenPayload {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
}
