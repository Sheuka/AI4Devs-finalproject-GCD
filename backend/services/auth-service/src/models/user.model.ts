import { UserRole, $Enums, User } from "@prisma/client";


// Tipo para crear un nuevo usuario
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole | typeof $Enums.UserRole.CLIENT;
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
  role: UserRole;
  isActive: boolean;
  phoneNumber: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Función para sanitizar la respuesta del usuario
export function sanitizeUser(user: User): UserResponse {
  const {
    password,
    ...userWithoutPassword
  } = user;
  
  return {
    ...userWithoutPassword,
    phoneNumber: user.phoneNumber || null,
    profilePicture: user.profilePicture || null
  };
}
