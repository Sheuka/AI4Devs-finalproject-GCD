import { Request, Response, NextFunction } from 'express';
import { createProject, updateProject, getProjectById, getProjectsByClient, assignProfessional } from '../services/projectService';
import { ProjectCreateDTO, ProjectUpdateDTO } from '../types/project.types';

export const createProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectData: ProjectCreateDTO = req.body;
        const project = await createProject(projectData);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const clientId = req.user.clientId; // Asumiendo que el ID del cliente está en el token
        const updateData: ProjectUpdateDTO = req.body;
        const project = await updateProject(projectId, clientId, updateData);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

export const getProjectByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

export const getProjectsByClientHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = req.user.userId; // Asumiendo que el ID del cliente está en el token
        const projects = await getProjectsByClient(clientId);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

export const assignProfessionalHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const professionalId = req.body.professionalId;
        const project = await assignProfessional(projectId, professionalId);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};
