export const provincias = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
    "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria",
    "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Gerona", "Granada",
    "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares",
    "Jaén", "León", "Lérida", "La Rioja", "Lugo", "Madrid", "Málaga",
    "Murcia", "Navarra", "Orense", "Palencia", "Las Palmas", "Pontevedra",
    "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria",
    "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya",
    "Zamora", "Zaragoza"
  ];
  
  export interface Professional {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    speciality?: string;
    province: string;
    locality: string;
    isActive: boolean;
  }
  
  export interface ProfessionalFormData {
    role: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    speciality?: string;
    province: string;
    locality: string;
  }

  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePicture?: string;
    rating?: number;
  }

  export interface UpdateUserData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  } 

  export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
