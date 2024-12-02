import { body, param } from 'express-validator';

export const createQuoteValidator = [
    body('projectId').isString().notEmpty().withMessage('Project ID es obligatorio'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount debe ser un número mayor que 0'),
    body('message').optional().isString().withMessage('Message debe ser una cadena de texto'),
];

export const updateQuoteValidator = [
    param('id').isString().notEmpty().withMessage('ID del presupuesto es obligatorio'),
    body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount debe ser un número mayor que 0'),
    body('message').optional().isString().withMessage('Message debe ser una cadena de texto'),
];

export const retractQuoteValidator = [
    param('id').isString().notEmpty().withMessage('ID del presupuesto es obligatorio'),
];
