import { body, param } from 'express-validator';

export const createProjectValidator = [
    body('clientId').isString().notEmpty().withMessage('Client ID es obligatorio'),
    body('title').isString().notEmpty().withMessage('Título es obligatorio'),
    body('description').isString().notEmpty().withMessage('Descripción es obligatoria'),
];

export const updateProjectValidator = [
    param('id').isString().notEmpty().withMessage('ID del proyecto es obligatorio'),
    body('title').optional().isString().withMessage('Título debe ser una cadena de texto'),
    body('description').optional().isString().withMessage('Descripción debe ser una cadena de texto'),
];

export const assignProfessionalValidator = [
    param('id').isString().notEmpty().withMessage('ID del proyecto es obligatorio'),
    body('professionalId').isString().notEmpty().withMessage('ID del profesional es obligatorio'),
];

export const updateProjectQuoteValidator = [
    param('id').isString().notEmpty().withMessage('ID del proyecto es obligatorio'),
    param('quoteId').isString().notEmpty().withMessage('ID del presupuesto es obligatorio'),
    body('action').isString().notEmpty().isIn(['accept', 'reject']).withMessage('Acción es obligatoria'),
];
