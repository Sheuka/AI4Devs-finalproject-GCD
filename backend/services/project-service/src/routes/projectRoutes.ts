import { Router } from 'express';
import {
    createProjectHandler,
    updateProjectHandler,
    getProjectByIdHandler,
    getProjectsByClientHandler,
    assignProfessionalHandler
} from '../controllers/projectController';
import authenticate from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
    createProjectValidator,
    updateProjectValidator,
    assignProfessionalValidator
} from '../validators/projectValidators';
import { param } from 'express-validator';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Crear un nuevo proyecto
router.post(
    '/',
    createProjectValidator,
    validateRequest,
    createProjectHandler
);

// Actualizar un proyecto existente
router.put(
    '/:id',
    updateProjectValidator,
    validateRequest,
    updateProjectHandler
);

// Obtener detalles de un proyecto por ID
router.get(
    '/:id',
    param('id').isString().notEmpty().withMessage('ID del proyecto es obligatorio'),
    validateRequest,
    getProjectByIdHandler
);

// Obtener todos los proyectos de un cliente
router.get(
    '/',
    getProjectsByClientHandler
);

// Asignar un profesional a un proyecto
router.post(
    '/:id/assign',
    assignProfessionalValidator,
    validateRequest,
    assignProfessionalHandler
);

export default router;
