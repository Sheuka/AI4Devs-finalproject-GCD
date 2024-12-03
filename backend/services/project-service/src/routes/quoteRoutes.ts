import { Router } from 'express';
import {
    createQuoteHandler,
    updateQuoteHandler,
    retractQuoteHandler,
    getQuotesByProjectHandler,
    getQuotesByProfessionalHandler
} from '../controllers/quoteController';
import authenticate from '../middlewares/authentication.middleware';
import authorize from '../middlewares/authorization.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
    createQuoteValidator,
    updateQuoteValidator,
    retractQuoteValidator
} from '../validators/quoteValidators';
import { param } from 'express-validator';
import { UserRole } from '../types/auth.types';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Crear un nuevo presupuesto (Permitido para PROFESSIONAL)
router.post(
    '/',
    authorize([UserRole.PROFESSIONAL]),
    createQuoteValidator,
    validateRequest,
    createQuoteHandler
);

// Actualizar un presupuesto existente (Permitido para PROFESSIONAL)
router.put(
    '/:id',
    authorize([UserRole.PROFESSIONAL]),
    updateQuoteValidator,
    validateRequest,
    updateQuoteHandler
);

// Retirar un presupuesto existente (Permitido para PROFESSIONAL)
router.post(
    '/:id/retract',
    authorize([UserRole.PROFESSIONAL]),
    retractQuoteValidator,
    validateRequest,
    retractQuoteHandler
);

// Obtener todos los presupuestos de un proyecto (Permitido para CLIENT, PROFESSIONAL y ADMIN)
router.get(
    '/project/:projectId',
    authorize([UserRole.CLIENT, UserRole.PROFESSIONAL, UserRole.ADMIN]),
    param('projectId').isString().notEmpty().withMessage('Project ID es obligatorio'),
    validateRequest,
    getQuotesByProjectHandler
);

// Obtener todos los presupuestos enviados por un profesional (Permitido para PROFESSIONAL y ADMIN)
router.get(
    '/professional',
    authorize([UserRole.PROFESSIONAL, UserRole.ADMIN]),
    getQuotesByProfessionalHandler
);

export default router;
