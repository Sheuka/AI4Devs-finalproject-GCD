import { Router } from 'express';
import { body, param } from 'express-validator';
import * as UserController from '../controllers/user.controller';
import authenticate from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import rateLimit from 'express-rate-limit';
import { UserRole } from '@prisma/client';

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

// Funciones reutilizables para validaciones
const validateId = () => [
  param('id')
    .isUUID()
    .withMessage('El ID proporcionado no es válido'),
];

const validateEmail = () => [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
];

const validatePassword = (minLength: number) => [
  body('password')
    .optional()
    .isLength({ min: minLength })
    .withMessage(`La contraseña debe tener al menos ${minLength} caracteres`)
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
];

const validateName = (field: string) => [
  body(field)
    .optional()
    .notEmpty()
    .withMessage(`El ${field} no puede estar vacío`),
];

const validateRole = () => [
  body('role')
    .optional()
    .isIn([UserRole.CLIENT, UserRole.PROFESSIONAL])
    .withMessage(`El rol debe ser ${UserRole.CLIENT} o ${UserRole.PROFESSIONAL}`),
];

// Validaciones para registro
const registerValidation = [
    ...validateEmail(),
    ...validatePassword(8),
    ...validateName('firstName'),
    ...validateName('lastName'),
    ...validateRole(),
];

// Validaciones para actualización de usuario
const updateUserValidation = [
  ...validateId(),
  ...validateEmail(),
  ...validatePassword(8),
  ...validateName('firstName'),
  ...validateName('lastName'),
  ...validateRole(),
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
