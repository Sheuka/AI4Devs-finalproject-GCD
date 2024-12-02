import { ProfessionalFormData } from '../types/user';
import createAxiosInstance from '../utils/axiosInstance';

const axiosInstance = createAxiosInstance(import.meta.env.VITE_USER_API_URL);

const mockData = {
  kpis: [
    { label: 'Total Clientes', value: 1234, color: 'bg-green-100 text-green-800' },
    { label: 'Total Profesionales', value: 567, color: 'bg-blue-100 text-blue-800' },
    { label: 'Proyectos Activos', value: 89, color: 'bg-orange-100 text-orange-800' },
    { label: 'Proyectos Completados', value: 432, color: 'bg-purple-100 text-purple-800' }
  ],
  
  monthlyData: [
    { month: 'Ene', newClients: 65, newProfessionals: 28 },
    { month: 'Feb', newClients: 59, newProfessionals: 35 },
    { month: 'Mar', newClients: 80, newProfessionals: 42 },
    { month: 'Abr', newClients: 81, newProfessionals: 32 },
    { month: 'May', newClients: 56, newProfessionals: 39 },
    { month: 'Jun', newClients: 95, newProfessionals: 45 }
  ],

  projectDistribution: [
    { name: 'Abiertos', value: 35 },
    { name: 'En Progreso', value: 45 },
    { name: 'Completados', value: 20 }
  ],

  activityTrend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toLocaleDateString(),
    registrations: Math.floor(Math.random() * 50) + 10,
    projectsCreated: Math.floor(Math.random() * 30) + 5
  })),

  recentProjects: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Proyecto ${i + 1}`,
    clientName: `Cliente ${i + 1}`,
    professionalName: i % 3 === 0 ? null : `Profesional ${i + 1}`,
    status: ['Abierto', 'En Progreso', 'Completado'][i % 3],
    createdAt: new Date(2024, 0, i + 1).toISOString()
  }))
};

const getKpis = async () => {
  return Promise.resolve(mockData.kpis);
};

const getMonthlyData = async () => {
  return Promise.resolve(mockData.monthlyData);
};

const getProjectDistribution = async () => {
  return Promise.resolve(mockData.projectDistribution);
};

const getActivityTrend = async () => {
  return Promise.resolve(mockData.activityTrend);
};

const getRecentProjects = async () => {
  return Promise.resolve(mockData.recentProjects);
};

const getProfessionals = async () => {
  try {
    const response = await axiosInstance.get(`/professionals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw new Error('Error al obtener el listado de profesionales');
  }
};

const createProfessional = async (data: Omit<ProfessionalFormData, 'id' | 'isActive'>) => {
  try {
    data.role = 'PROFESSIONAL';
    const response = await axiosInstance.post(`/professionals`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating professional:', error);
    throw new Error('Error al crear el profesional');
  }
};

const updateProfessional = async (id: string, data: Partial<ProfessionalFormData>) => {
  try {
    const response = await axiosInstance.put(`/professionals/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating professional:', error);
    throw new Error('Error al actualizar el profesional');
  }
};

const toggleProfessionalStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(`/professionals/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling professional status:', error);
    throw new Error('Error al cambiar el estado del profesional');
  }
};

const deleteProfessional = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/professionals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting professional:', error);
    throw new Error('Error al eliminar el profesional');
  }
};

export default {
  getKpis,
  getMonthlyData,
  getProjectDistribution,
  getActivityTrend,
  getRecentProjects,
  getProfessionals,
  createProfessional,
  updateProfessional,
  toggleProfessionalStatus,
  deleteProfessional
}; 