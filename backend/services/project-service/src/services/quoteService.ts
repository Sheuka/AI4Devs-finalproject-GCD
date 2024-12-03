import { PrismaClient, Quote, QuoteStatus } from '@prisma/client';
import { QuoteCreateDTO, QuoteUpdateDTO, QuoteResponseDTO } from '../types/quote.types';
import { emailService } from './email.service';
import axios from 'axios';
import { config } from '../config';
import { User } from '../models/user';
import { getAuthToken } from './authService';

const prisma = new PrismaClient();

/**
 * Crea un nuevo presupuesto para un proyecto.
 * @param quoteData - Datos para crear el presupuesto.
 * @returns El presupuesto creado.
 * @throws Error si el proyecto no está en estado "open" o si el profesional ya ha enviado un presupuesto para este proyecto.
 */
export const createQuote = async (quoteData: QuoteCreateDTO, professionalId: string): Promise<QuoteResponseDTO> => {
    // Verificar que el proyecto exista y esté en estado "open"
    const project = await prisma.project.findUnique({
        where: { project_id: quoteData.projectId },
    });

    if (!project) {
        throw new Error('Proyecto no encontrado');
    }

    if (project.status !== 'open') {
        throw new Error('No se pueden enviar presupuestos para proyectos que no están abiertos');
    }

    // Verificar que el profesional no haya enviado ya un presupuesto para este proyecto
    const existingQuote = await prisma.quote.findFirst({
        where: {
            project_id: quoteData.projectId,
            professional_id: professionalId,
            status: {
                not: QuoteStatus.rejected,
            },
        },
    });

    if (existingQuote) {
        throw new Error('Ya has enviado un presupuesto para este proyecto');
    }

    const quote = await prisma.quote.create({
        data: {
            project_id: quoteData.projectId,
            professional_id: professionalId,
            amount: Number(quoteData.amount),
            message: quoteData.message ?? undefined,
            estimated_time: quoteData.estimatedDuration ?? undefined,
            status: QuoteStatus.pending,
        },
    });

    const responseDTO = mapQuoteToResponseDTO(quote);

    // Obtener el email del cliente
    const clientEmail = await getClientEmail(project.client_id);

    // Enviar correo al cliente
    await emailService.sendQuoteCreatedEmail(clientEmail, project.title, responseDTO);

    return responseDTO;
};

/**
 * Obtiene todos los presupuestos de un proyecto.
 * @param projectId - ID del proyecto.
 * @returns Lista de presupuestos asociados al proyecto.
 */
export const getQuotesByProject = async (projectId: string): Promise<QuoteResponseDTO[]> => {
    const quotes = await prisma.quote.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: 'desc' },
    });

    return quotes.map(mapQuoteToResponseDTO);
};

/**
 * Actualiza un presupuesto existente.
 * @param quoteId - ID del presupuesto a actualizar.
 * @param professionalId - ID del profesional que realiza la actualización.
 * @param updateData - Datos para actualizar el presupuesto.
 * @returns El presupuesto actualizado.
 * @throws Error si el presupuesto no existe, no pertenece al profesional, o no está en estado "pending".
 */
export const updateQuote = async (
    quoteId: string,
    professionalId: string,
    updateData: QuoteUpdateDTO
): Promise<QuoteResponseDTO> => {
    const quote = await prisma.quote.findUnique({
        where: { quote_id: quoteId },
    });

    if (!quote) {
        throw new Error('Presupuesto no encontrado');
    }

    if (quote.professional_id !== professionalId) {
        throw new Error('No tienes permisos para actualizar este presupuesto');
    }

    if (quote.status !== QuoteStatus.pending) {
        throw new Error('Solo se pueden modificar presupuestos en estado "pending"');
    }

    const updatedQuote = await prisma.quote.update({
        where: { quote_id: quoteId },
        data: {
            amount: updateData.amount ?? quote.amount,
            message: updateData.message ?? quote.message,
            estimated_time: updateData.estimatedDuration ?? quote.estimated_time,
        },
    });

    const responseDTO = mapQuoteToResponseDTO(updatedQuote);

    // Obtener el proyecto asociado
    const project = await prisma.project.findUnique({
        where: { project_id: updatedQuote.project_id },
    });

    if (project) {
        // Obtener el email del cliente
        const clientEmail = await getClientEmail(project.client_id);

        // Enviar correo al cliente
        await emailService.sendQuoteUpdatedEmail(clientEmail, project.title, responseDTO);
    }

    return responseDTO;
};

/**
 * Retira un presupuesto existente.
 * @param quoteId - ID del presupuesto a retirar.
 * @param professionalId - ID del profesional que realiza la retirada.
 * @returns El presupuesto actualizado con el estado "rejected".
 * @throws Error si el presupuesto no existe, no pertenece al profesional, o no está en estado "pending".
 */
export const retractQuote = async (quoteId: string, professionalId: string): Promise<QuoteResponseDTO> => {
    const quote = await prisma.quote.findUnique({
        where: { quote_id: quoteId },
    });

    if (!quote) {
        throw new Error('Presupuesto no encontrado');
    }

    if (quote.professional_id !== professionalId) {
        throw new Error('No tienes permisos para retirar este presupuesto');
    }

    if (quote.status !== QuoteStatus.pending) {
        throw new Error('Solo se pueden retirar presupuestos en estado "pending"');
    }

    const updatedQuote = await prisma.quote.update({
        where: { quote_id: quoteId },
        data: {
            status: QuoteStatus.rejected,
        },
    });

    return mapQuoteToResponseDTO(updatedQuote);
};

/**
 * Obtiene todos los presupuestos enviados por un profesional.
 * @param professionalId - ID del profesional.
 * @returns Lista de presupuestos enviados por el profesional.
 */
export const getQuotesByProfessional = async (professionalId: string): Promise<QuoteResponseDTO[]> => {
    const quotes = await prisma.quote.findMany({
        where: { professional_id: professionalId },
        orderBy: { created_at: 'desc' },
    });

    return quotes.map(mapQuoteToResponseDTO);
};

/**
 * Mapea el modelo de Prisma a el DTO de respuesta.
 * @param quote - Presupuesto del modelo Prisma.
 * @returns Presupuesto mapeado al DTO de respuesta.
 */
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

/**
 * Obtiene el email del cliente desde el servicio de usuarios.
 * @param clientId - ID del cliente.
 * @returns Email del cliente.
 * @throws Error si no se puede obtener el email.
 */
const getClientEmail = async (clientId: string): Promise<string> => {
    try {
        const token = await getAuthToken();

        const response = await axios.get(`${config.USER_SERVICE_URL}/api/users/${clientId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user: User = response.data;
        return user.email;
    } catch (error) {
        console.error(`Error al obtener el email del cliente con ID ${clientId}:`, error);
        throw new Error('No se pudo obtener el email del cliente');
    }
};
