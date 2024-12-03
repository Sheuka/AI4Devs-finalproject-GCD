import { Request, Response, NextFunction } from 'express';
import { createQuote, updateQuote, retractQuote, getQuotesByProject, getQuotesByProfessional } from '../services/quoteService';
import { QuoteCreateDTO, QuoteUpdateDTO } from '../types/quote.types';

export const createQuoteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionalId = req.user.userId; // Asumiendo que el ID del profesional está en el token
        const quoteData: QuoteCreateDTO = req.body;
        const quote = await createQuote(quoteData, professionalId);
        res.status(201).json(quote);
    } catch (error) {
        next(error);
    }
};

export const updateQuoteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quoteId = req.params.id;
        const professionalId = req.user.userId; // Asumiendo que el ID del profesional está en el token
        const updateData: QuoteUpdateDTO = req.body;
        const quote = await updateQuote(quoteId, professionalId, updateData);
        res.status(200).json(quote);
    } catch (error) {
        next(error);
    }
};

export const retractQuoteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quoteId = req.params.id;
        const professionalId = req.user.userId; // Asumiendo que el ID del profesional está en el token
        const quote = await retractQuote(quoteId, professionalId);
        res.status(200).json(quote);
    } catch (error) {
        next(error);
    }
};

export const getQuotesByProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.projectId;
        const quotes = await getQuotesByProject(projectId);
        res.status(200).json(quotes);
    } catch (error) {
        next(error);
    }
};

export const getQuotesByProfessionalHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const professionalId = req.user.userId; // Asumiendo que el ID del profesional está en el token
        const quotes = await getQuotesByProfessional(professionalId);
        res.status(200).json(quotes);
    } catch (error) {
        next(error);
    }
};
