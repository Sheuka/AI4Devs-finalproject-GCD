import { ClientProject, ProfessionalProject, Quote, QuoteFormData } from '../types/project';
import createAxiosInstance from '../utils/axiosInstance';
import { Message } from '../types/project';

const axiosInstance = createAxiosInstance(import.meta.env.VITE_PROJECT_API_URL);

interface ProjectData {
  title: string;
  description: string;
  userId: string;
}

interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: string;
}

const createProject = async (data: ProjectData) => {
  const response = await axiosInstance.post('/projects', data);
  return response.data;
};

const getProject = async (id: string): Promise<ClientProject> => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return {
    ...response.data,
    budgets: response.data.budgets || []
  };
};

const updateProject = async (id: string, data: UpdateProjectData) => {
  const response = await axiosInstance.put(`/projects/${id}`, data);
  return response.data;
};

const getUserProjects = async (): Promise<ClientProject[]> => {
  const response = await axiosInstance.get(`/projects`);
  return response.data;
};

const updateQuoteStatus = async (id: string, quoteId: string, action: 'accept' | 'reject'): Promise<ClientProject> => {
  const response = await axiosInstance.put(`/projects/${id}/quotes/${quoteId}`, { action });
  return response.data;
};

const getProfessionalProjects = async (): Promise<ProfessionalProject[]> => {
  try {
    const response = await axiosInstance.get('/projects/professional');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los proyectos disponibles:', error);
    throw new Error('No se pudieron obtener los proyectos disponibles');
  }
};

const getProfessionalProject = async (id: string): Promise<ProfessionalProject> => {
  try {
    const response = await axiosInstance.get(`/projects/${id}/professional`);
    return {...response.data, quote: response.data.quotes[0] || null};
  } catch (error) {
    console.error(`Error al obtener el proyecto profesional con ID ${id}:`, error);
    throw new Error('No se pudo obtener el proyecto profesional');
  }
};

const createQuote = async (data: QuoteFormData): Promise<Quote> => {
  try {
    const response = await axiosInstance.post(`/quotes`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al crear la cotización para el proyecto ${data.projectId}:`, error);
    throw new Error('No se pudo crear la cotización');
  }
};

const updateQuote = async (quoteId: string, data: Partial<QuoteFormData>): Promise<Quote> => {
  try {
    const response = await axiosInstance.put(`/quotes/${quoteId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la cotización ${quoteId} del proyecto ${data.projectId}:`, error);
    throw new Error('No se pudo actualizar la cotización');
  }
};

const deleteQuote = async (quoteId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/quotes/${quoteId}/retract`);
  } catch (error) {
    console.error(`Error al eliminar la cotización ${quoteId}:`, error);
    throw new Error('No se pudo eliminar la cotización');
  }
};

const getChatMessages = async (projectId: string): Promise<Message[]> => {
  const response = await axiosInstance.get(`/projects/${projectId}/chat`);
  return response.data;
};

const sendMessage = async (projectId: string, message: string) => {
  const response = await axiosInstance.post(`/projects/${projectId}/chat`, { content:message });
  return response.data;
};

export default {
  createProject,
  getProject,
  updateProject,
  getUserProjects,
  updateQuoteStatus,
  getProfessionalProjects,
  getProfessionalProject,
  createQuote,
  updateQuote,
  deleteQuote,
  getChatMessages,
  sendMessage,
}; 