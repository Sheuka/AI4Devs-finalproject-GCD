import { PrismaClient, Quote, QuoteStatus } from '@prisma/client';
import { QuoteCreateDTO, QuoteUpdateDTO, QuoteResponseDTO } from '../types/quote.types';

const prisma = new PrismaClient();

/**
 * Crea un nuevo presupuesto para un proyecto.
 * @param quoteData - Datos para crear el presupuesto.
 * @returns El presupuesto creado.
 * @throws Error si el proyecto no está en estado "open" o si el profesional ya ha enviado un presupuesto para este proyecto.
 */
export const createQuote = async (quoteData: QuoteCreateDTO): Promise<QuoteResponseDTO> => {
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
            professional_id: quoteData.professionalId,
        },
    });

    if (existingQuote) {
        throw new Error('Ya has enviado un presupuesto para este proyecto');
    }

    const quote = await prisma.quote.create({
        data: {
            project_id: quoteData.projectId,
            professional_id: quoteData.professionalId,
            amount: quoteData.amount,
            message: quoteData.message,
            status: QuoteStatus.pending,
        },
    });

    return mapQuoteToResponseDTO(quote);
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
        },
    });

    return mapQuoteToResponseDTO(updatedQuote);
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
    status: quote.status,
    createdAt: quote.created_at,
    updatedAt: quote.updated_at,
});
