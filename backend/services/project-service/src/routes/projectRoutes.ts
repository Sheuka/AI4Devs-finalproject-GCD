import { Router } from 'express';
import {
    createProjectHandler,
    updateProjectHandler,
    getProjectByIdHandler,
    getProjectsByClientHandler,
    assignProfessionalHandler,
    getProjectsForProfessionalHandler,
    getProjectByIdForProfessionalHandler,
    updateProjectQuoteHandler
} from '../controllers/projectController';
import authenticate from '../middlewares/authentication.middleware';
import authorize from '../middlewares/authorization.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
    createProjectValidator,
    updateProjectValidator,
    assignProfessionalValidator,
    updateProjectQuoteValidator
} from '../validators/projectValidators';
import { param } from 'express-validator';
import { UserRole } from '../types/auth.types';
import { getChatMessagesHandler, sendChatMessageHandler } from '../controllers/chatController';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Crear un nuevo proyecto (Permitido para CLIENT y ADMIN)
router.post(
    '/',
    authorize([UserRole.CLIENT, UserRole.ADMIN]),
    createProjectValidator,
    validateRequest,
    createProjectHandler
);

// Actualizar un proyecto existente (Permitido para CLIENT y ADMIN)
router.put(
    '/:id',
    authorize([UserRole.CLIENT, UserRole.ADMIN]),
    updateProjectValidator,
    validateRequest,
    updateProjectHandler
);

// Actualizar el estado de un presupuesto en un proyecto (Permitido para CLIENT y ADMIN)
router.put(
    '/:id/quotes/:quoteId',
    authorize([UserRole.CLIENT, UserRole.ADMIN]),
    updateProjectQuoteValidator,
    validateRequest,
    updateProjectQuoteHandler
);

// Obtener proyectos para profesionales (Permitido para PROFESSIONAL y ADMIN)
router.get(
    '/professional',
    authorize([UserRole.PROFESSIONAL, UserRole.ADMIN]),
    getProjectsForProfessionalHandler
);

// Obtener detalles de un proyecto por ID (Permitido para CLIENT, PROFESSIONAL y ADMIN)
router.get(
    '/:id',
    authorize([UserRole.CLIENT, UserRole.PROFESSIONAL, UserRole.ADMIN]),
    param('id').isString().notEmpty().withMessage('ID del proyecto es obligatorio'),
    validateRequest,
    getProjectByIdHandler
);

// Obtener detalles de un proyecto por ID para profesionales (Permitido para PROFESSIONAL y ADMIN)
router.get(
    '/:id/professional',
    authorize([UserRole.PROFESSIONAL, UserRole.ADMIN]),
    getProjectByIdForProfessionalHandler
);

// Obtener todos los proyectos de un cliente (Permitido para CLIENT y ADMIN)
router.get(
    '/',
    authorize([UserRole.CLIENT, UserRole.ADMIN]),
    getProjectsByClientHandler
);

// Asignar un profesional a un proyecto (Solo ADMIN)
router.post(
    '/:id/assign',
    authorize([UserRole.ADMIN]),
    assignProfessionalValidator,
    validateRequest,
    assignProfessionalHandler
);

// Obtener todos los mensajes de un proyecto (Permitido para CLIENT, PROFESSIONAL y ADMIN)
router.get(
    '/:id/chat',
    authorize([UserRole.CLIENT, UserRole.PROFESSIONAL, UserRole.ADMIN]),
    validateRequest,
    getChatMessagesHandler
);

// Enviar un mensaje a un proyecto (Permitido para CLIENT, PROFESSIONAL y ADMIN)
router.post(
    '/:id/chat',
    authorize([UserRole.CLIENT, UserRole.PROFESSIONAL, UserRole.ADMIN]),
    validateRequest,
    sendChatMessageHandler
);

export default router;
