import axios from 'axios';
import { PrismaClient, Project, ProjectStatus, Quote, QuoteStatus } from '@prisma/client';
import { ProjectCreateDTO, ProjectUpdateDTO, ProjectResponseDTO } from '../types/project.types';
import { emailService } from './email.service';
import { config } from '../config';
import { User } from '../models/user';
import { QuoteResponseDTO } from '../types/quote.types';
import { getAuthToken } from './authService';

const prisma = new PrismaClient();

/**
 * Obtiene la lista de profesionales desde el servicio de usuarios.
 */
const getProfessionals = async (): Promise<User[]> => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${config.USER_SERVICE_URL}/api/professionals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener profesionales:', error);
        throw new Error('No se pudieron obtener los profesionales');
    }
};

/**
 * Obtiene la lista de profesionales desde el servicio de usuarios.
 */
const getProfessionalById = async (professionalId: string): Promise<User> => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`${config.USER_SERVICE_URL}/api/professionals/${professionalId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener profesionales:', error);
        throw new Error('No se pudieron obtener los profesionales');
    }
};

/**
 * Crea un nuevo proyecto y notifica a los profesionales.
 * @param projectData - Datos para crear el proyecto.
 * @returns El proyecto creado.
 */
export const createProject = async (projectData: ProjectCreateDTO): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.create({
        data: {
            client_id: projectData.clientId,
            title: projectData.title,
            description: projectData.description,
            type: projectData.type,
            amount: projectData.amount,
            budget: projectData.budget,
            start_date: projectData.startDate,
            status: ProjectStatus.open,
        },
    });

    const projectDTO = mapProjectToResponseDTO(project);

    const professionals = await getProfessionals();

    await Promise.all(professionals.map(professional => {
        return emailService.sendNewProjectEmail(professional.email, projectDTO);
    }));

    return projectDTO;
};

/**
 * Actualiza los detalles de un proyecto.
 * @param projectId - ID del proyecto a actualizar.
 * @param clientId - ID del cliente que solicita la actualización.
 * @param updateData - Datos para actualizar el proyecto.
 * @returns El proyecto actualizado.
 * @throws Error si el proyecto no existe, no pertenece al cliente o no está en estado "open".
 */
export const updateProject = async (
    projectId: string,
    userId: string,
    updateData: ProjectUpdateDTO
): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.findUnique({
        where: { project_id: projectId },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    if (project.client_id !== userId) {
        throw new Error('No tienes permisos para actualizar este proyecto');
    }

    if (project.status !== ProjectStatus.open) {
        throw new Error('Solo se pueden actualizar proyectos en estado "open"');
    }

    const updatedProject = await prisma.project.update({
        where: { project_id: projectId },
        data: {
            title: updateData.title ?? project.title,
            description: updateData.description ?? project.description,
        },
    });

    return mapProjectToResponseDTO(updatedProject);
};

/**
 * Asigna un profesional a un proyecto.
 * @param projectId - ID del proyecto a asignar.
 * @param professionalId - ID del profesional a asignar.
 * @returns El proyecto con el profesional asignado.
 * @throws Error si el proyecto no existe o ya tiene un profesional asignado.
 */
export const assignProfessional = async (projectId: string, professionalId: string): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.findUnique({
        where: { project_id: projectId },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    if (project.professional_id) {
        throw new Error('Este proyecto ya tiene un profesional asignado');
    }

    const updatedProject = await prisma.project.update({
        where: { project_id: projectId },
        data: {
            professional_id: professionalId,
            status: ProjectStatus.in_progress,
        },
    });

    return mapProjectToResponseDTO(updatedProject);
};

/**
 * Obtiene los detalles de un proyecto por su ID.
 * @param projectId - ID del proyecto.
 * @returns El proyecto encontrado.
 * @throws Error si el proyecto no existe.
 */
export const getProjectById = async (projectId: string): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.findUnique({
        where: { project_id: projectId },
        include: {
            quotes: {
                where: {
                    status: {
                        not: QuoteStatus.rejected,
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            },
        },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    return mapProject(project);
};

/**
 * Obtiene todos los proyectos de un cliente, ordenados por fecha de creación descendente.
 * @param clientId - ID del cliente.
 * @returns Lista de proyectos del cliente.
 */
export const getProjectsByClient = async (clientId: string): Promise<ProjectResponseDTO[]> => {
    const projects = await prisma.project.findMany({
        where: { client_id: clientId },
        orderBy: { created_at: 'desc' },
        include: {
            quotes: {
                orderBy: {
                    created_at: 'desc',
                },
            },
        },
    });

    return projects.map(mapProject);
};

/**
 * Actualiza el estado de un presupuesto en un proyecto.
 * @param projectId - ID del proyecto.
 * @param quoteId - ID del presupuesto.
 * @param action - Acción a realizar ('accept' | 'reject').
 * @returns El proyecto actualizado.
 * @throws Error si el proyecto o presupuesto no existen o no tienen los permisos adecuados.
 */
export const updateProjectQuote = async (
    projectId: string,
    quoteId: string,
    action: 'accept' | 'reject'
): Promise<ProjectResponseDTO> => {
    // Actualizar el presupuesto
    const updatedQuote = await prisma.quote.update({
        where: { quote_id: quoteId },
        data: { status: action === 'accept' ? QuoteStatus.accepted : QuoteStatus.rejected },
    });

    if (action === 'accept') {
        await prisma.quote.updateMany({
            where: { 
                project_id: projectId,
                quote_id: {
                    not: quoteId,
                }
             },
            data: {
                status: QuoteStatus.rejected,
            },
        });
    }

    // Actualizar el estado del proyecto
    await prisma.project.update({   
        where: { project_id: projectId },
        data: { 
            status: action === 'accept' ? ProjectStatus.in_progress : ProjectStatus.open,
            professional_id: action === 'accept' ? updatedQuote.professional_id : null,
        },
    });

    // Obtener el proyecto actualizado
    const project = await getProjectById(projectId);

    // Obtener los detalles del presupuesto actualizado
    const quoteDTO = mapQuoteToResponseDTO(updatedQuote);

    // Obtener información del profesional
    const professional = await getProfessionalById(updatedQuote.professional_id);

    if (professional && professional.email) {
        if (action === 'accept') {
            await emailService.sendQuoteAcceptedEmail(professional.email, project.title, quoteDTO);
        } else {
            await emailService.sendQuoteRejectedEmail(professional.email, project.title, quoteDTO);
        }
    } else {
        console.error(`No se encontró el profesional con ID ${updatedQuote.professional_id} o su correo electrónico.`);
    }

    return project;
};

/**
 * Mapea el modelo de Prisma a el DTO de respuesta.
 * @param project - Proyecto del modelo Prisma.
 * @returns Proyecto mapeado al DTO de respuesta.
 */
const mapProjectToResponseDTO = (project: Project): ProjectResponseDTO => ({
    id: project.project_id,
    clientId: project.client_id,
    professionalId: project.professional_id ?? undefined,
    title: project.title,
    description: project.description,
    status: project.status,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    type: project.type,
    amount: project.amount,
    budget: project.budget,
    startDate: project.start_date,
});

const mapQuoteToResponseDTO = (quote: Quote): QuoteResponseDTO => ({
    quoteId: quote.quote_id,
    projectId: quote.project_id,
    professionalId: quote.professional_id,
    amount: quote.amount,
    message: quote.message ?? undefined,
    estimatedDuration: quote.estimated_time ?? undefined,
    status: quote.status,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at,
});

const mapProject = (project: any): ProjectResponseDTO & { quotes?: QuoteResponseDTO[] } => {
    const projectDTO = mapProjectToResponseDTO(project);
    if (project.quotes && project.quotes.length > 0) {
        projectDTO.quotes = project.quotes.map(mapQuoteToResponseDTO);
    }
    else {
        projectDTO.quotes = [];
    }
    return projectDTO;
};

/**
 * Obtiene los proyectos para un profesional basado en el estado y asignación.
 * @param professionalId - ID del profesional.
 * @returns Lista de proyectos con presupuestos si aplican.
 */
export const getProjectsForProfessional = async (professionalId: string): Promise<(ProjectResponseDTO & { quote?: QuoteResponseDTO })[]> => {
    // Proyectos en estado 'open'
    const openProjects = await prisma.project.findMany({
        where: {
            status: ProjectStatus.open,
        },
        include: {
            quotes: {
                where: {
                    professional_id: professionalId,
                },
                take: 1, // Obtener un presupuesto si existe
            },
        },
    });

    // Proyectos en estado 'in_progress' o 'completed' asignados al profesional
    const assignedProjects = await prisma.project.findMany({
        where: {
            status: {
                in: [ProjectStatus.in_progress, ProjectStatus.completed, ProjectStatus.closed],
            },
            professional_id: professionalId,
        },
        include: {
            quotes: {
                where: {
                    professional_id: professionalId,
                },
                take: 1,
            },
        },
    });

    return [...openProjects, ...assignedProjects].map(mapProject);
};



/**
 * Obtiene los detalles de un proyecto por su ID.
 * @param projectId - ID del proyecto.
 * @returns El proyecto encontrado.
 * @throws Error si el proyecto no existe.
 */
export const getProjectByIdForProfessional = async (projectId: string, professionalId: string): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.findUnique({
        where: { project_id: projectId },
        include: {
            quotes: {
                where: {
                    professional_id: professionalId,
                    status: {
                        not: QuoteStatus.rejected,
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 1,
            },
        },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    return mapProject(project);
};
