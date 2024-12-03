import { PasswordFormData, User } from '../types/user';
import createAxiosInstance from '../utils/axiosInstance';

const axiosInstance = createAxiosInstance(import.meta.env.VITE_USER_API_URL);

interface UpdateUserData {
  name?: string;
  email?: string;
  // Otros campos que se puedan actualizar
}

const getUser = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete('/users/delete');
};

const updatePassword = async (data: PasswordFormData): Promise<void> => {
  await axiosInstance.put('/users/password', data);
};

const updateProfile = async (data: UpdateUserData): Promise<User> => {
  const response = await axiosInstance.put('/users/profile', data);
  return response.data;
};

export default {
  getUser,
  updateUser,
  deleteAccount,
  updatePassword,
  updateProfile
}; 