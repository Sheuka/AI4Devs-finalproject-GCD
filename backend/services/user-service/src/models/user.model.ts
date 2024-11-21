export interface CreateUserDTO {
  email: string;
  password: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  profilePicture: string | null;
}

export interface UpdateUserDTO {
  password: string | null;
  firstName: string | null ;
  lastName: string | null;
  phoneNumber: string | null;
  profilePicture: string | null;
  isActive: boolean | null;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN',
}
