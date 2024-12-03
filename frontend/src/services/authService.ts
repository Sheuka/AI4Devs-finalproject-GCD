import createAxiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = createAxiosInstance(import.meta.env.VITE_AUTH_API_URL);

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  exp: number;
}

interface UserData {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  token: string;
}

const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error durante el registro.');
  }
};

const extractUserFromToken = (token: string): UserData => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      token: token
    };
  } catch (error) {
    throw new Error('Token inválido');
  }
};

const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    if (response.data.token) {
      const userData = extractUserFromToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('No se recibió token de autenticación');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error durante el inicio de sesión.');
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const recoverPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al enviar el correo de recuperación.');
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password`, { token, password: newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña.');
  }
};

export default {
  register,
  login,
  logout,
  recoverPassword,
  resetPassword,
  extractUserFromToken
};
