import { Router } from 'express';
import * as ProfessionalController from '../controllers/professional.controller';
import authenticate from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import rateLimit from 'express-rate-limit';
import { validateId, validateEmail, validateLocality, validateName, validatePassword, validateProvince, validateRole } from '../validations/user';

const router = Router();

// Middleware para limitar la tasa de solicitudes en rutas críticas
const createProfessionalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // límite de 15 solicitudes por IP
  message: 'Demasiadas solicitudes de creación desde esta IP, por favor intenta de nuevo más tarde.',
});

const updateProfessionalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // límite de 15 solicitudes por IP
  message: 'Demasiadas solicitudes de actualización desde esta IP, por favor intenta de nuevo más tarde.',
});

// Validaciones para registro
const registerValidation = [
    ...validateEmail(),
    ...validatePassword(8),
    ...validateName('firstName'),
    ...validateName('lastName'),
    ...validateRole(),
    ...validateProvince(),
    ...validateLocality(),
];

// Validaciones para actualización de usuario
const updateValidation = [
  ...validateId(),
  ...validateEmail(),
  ...validatePassword(8),
  ...validateName('firstName'),
  ...validateName('lastName'),
  ...validateRole(),
  ...validateProvince(),
  ...validateLocality(),
];

// Rutas
router.get(
  '/',
  authenticate,
  ProfessionalController.getAll
);

router.get(
  '/:id',
  authenticate,
  validateId(),
  validateRequest,
  ProfessionalController.getById
);

router.post(
  '/',
  authenticate,
  createProfessionalLimiter,
  registerValidation,
  validateRequest,
  ProfessionalController.create
);

router.put(
  '/:id',
  authenticate,
  updateProfessionalLimiter,
  validateId(),
  updateValidation,
  validateRequest,
  ProfessionalController.update
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  validateId(),
  validateRequest,
  ProfessionalController.toggleStatus
);

router.delete(
  '/:id',
  authenticate,
  validateId(),
  validateRequest,
  ProfessionalController.deleteProfessional
);

export default router; 