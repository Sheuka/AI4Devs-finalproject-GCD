// Tipo para crear un usuario
export interface CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
}

// Tipo para actualizar un usuario
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  isActive?: boolean;
}

// Tipo para la respuesta de usuario (sin datos sensibles)
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN',
}
