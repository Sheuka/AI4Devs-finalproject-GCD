import { PrismaClient, Project, ProjectStatus } from '@prisma/client';
import { ProjectCreateDTO, ProjectUpdateDTO, ProjectResponseDTO } from '../types/project.types';

const prisma = new PrismaClient();

/**
 * Crea un nuevo proyecto.
 * @param projectData - Datos para crear el proyecto.
 * @returns El proyecto creado.
 */
export const createProject = async (projectData: ProjectCreateDTO): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.create({
        data: {
            client_id: projectData.clientId,
            title: projectData.title,
            description: projectData.description,
            status: ProjectStatus.open,
        },
    });

    return mapProjectToResponseDTO(project);
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
    clientId: string,
    updateData: ProjectUpdateDTO
): Promise<ProjectResponseDTO> => {
    const project = await prisma.project.findUnique({
        where: { project_id: projectId },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    if (project.client_id !== clientId) {
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
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    return mapProjectToResponseDTO(project);
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
    });

    return projects.map(mapProjectToResponseDTO);
};

/**
 * Mapea el modelo de Prisma a el DTO de respuesta.
 * @param project - Proyecto del modelo Prisma.
 * @returns Proyecto mapeado al DTO de respuesta.
 */
const mapProjectToResponseDTO = (project: Project): ProjectResponseDTO => ({
    projectId: project.project_id,
    clientId: project.client_id,
    professionalId: project.professional_id ?? undefined,
    title: project.title,
    description: project.description,
    status: project.status,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
});
