import { Router } from 'express';
import {
    createQuoteHandler,
    updateQuoteHandler,
    retractQuoteHandler,
    getQuotesByProjectHandler,
    getQuotesByProfessionalHandler
} from '../controllers/quoteController';
import authenticate from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
    createQuoteValidator,
    updateQuoteValidator,
    retractQuoteValidator
} from '../validators/quoteValidators';
import { param } from 'express-validator';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Crear un nuevo presupuesto
router.post(
    '/',
    createQuoteValidator,
    validateRequest,
    createQuoteHandler
);

// Actualizar un presupuesto existente
router.put(
    '/:id',
    updateQuoteValidator,
    validateRequest,
    updateQuoteHandler
);

// Retirar un presupuesto existente
router.post(
    '/:id/retract',
    retractQuoteValidator,
    validateRequest,
    retractQuoteHandler
);

// Obtener todos los presupuestos de un proyecto
router.get(
    '/project/:projectId',
    param('projectId').isString().notEmpty().withMessage('Project ID es obligatorio'),
    validateRequest,
    getQuotesByProjectHandler
);

// Obtener todos los presupuestos enviados por un profesional
router.get(
    '/professional',
    getQuotesByProfessionalHandler
);

export default router;
