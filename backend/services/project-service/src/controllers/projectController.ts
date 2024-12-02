import { Request, Response, NextFunction } from 'express';
import { createProject, updateProject, getProjectById, getProjectsByClient, assignProfessional, getProjectsForProfessional, getProjectByIdForProfessional, updateProjectQuote } from '../services/projectService';
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
        const userId = req.user.userId; // Asumiendo que el ID del cliente está en el token
        const updateData: ProjectUpdateDTO = req.body;
        const project = await updateProject(projectId, userId, updateData);
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

export const updateProjectQuoteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const quoteId = req.params.quoteId;
        const action = req.body.action;
        const project = await updateProjectQuote(projectId, quoteId, action);
        res.status(200).json(project);
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

export const getProjectsForProfessionalHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionalId = req.user.userId;
        const projects = await getProjectsForProfessional(professionalId);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

export const getProjectByIdForProfessionalHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;
        const professionalId = req.user.userId;
        const project = await getProjectByIdForProfessional(projectId, professionalId);
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};
