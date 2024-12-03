import { Router } from 'express';
import { param } from 'express-validator';
import * as UserController from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import rateLimit from 'express-rate-limit';
import { validateId, validateEmail, validatePassword, validateName, validateRole, validateProvince, validateLocality } from '../validations/user';

const router = Router();

// Middleware para limitar la tasa de solicitudes en rutas críticas
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 solicitudes por IP
  message: 'Demasiadas solicitudes de registro desde esta IP, por favor intenta de nuevo más tarde.',
});

const updateUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // límite de 10 solicitudes por IP
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
const updateUserValidation = [
  ...validateId(),
  ...validateEmail(),
  ...validatePassword(8),
  ...validateName('firstName'),
  ...validateName('lastName'),
  ...validateRole(),
  ...validateProvince(),
  ...validateLocality(),
];

// Rutas públicas
router.post(
  '/register',
  authenticate,
  registerLimiter,
  registerValidation,
  validateRequest,
  UserController.register
);

// Rutas protegidas
router.get(
  '/:id',
  authenticate,
  validateId(),
  validateRequest,
  UserController.getUserById
);

router.get(
  '/email/:email',
  authenticate,
  [
    param('email')
      .isEmail()
      .withMessage('Debe proporcionar un email válido'),
  ],
  validateRequest,
  UserController.getUserByEmail
);

router.put(
  '/:id',
  authenticate,
  updateUserLimiter,
  updateUserValidation,
  validateRequest,
  UserController.updateUser
);

export default router;
