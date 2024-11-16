import { Router } from 'express';
import { body } from 'express-validator';
import * as AuthController from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';
import { UserRole } from '@prisma/client';

const router = Router();

// Middleware para limitar la tasa de solicitudes en rutas críticas
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // límite de 10 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 solicitudes por IP
  message: 'Demasiadas solicitudes de recuperación desde esta IP, por favor intenta de nuevo más tarde.',
});

// Funciones reutilizables para validaciones
const validateEmail = () => [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
];

const validatePassword = (minLength: number) => [
  body('password')
    .isLength({ min: minLength })
    .withMessage(`La contraseña debe tener al menos ${minLength} caracteres`)
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
];

const validateToken = () => [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido'),
];

const validateName = (field: string) => [
  body(field)
    .notEmpty()
    .withMessage(`El ${field} es requerido`),
];

const validateRole = () => [
  body('role')
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

// Validaciones para login
const loginValidation = [
  ...validateEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

// Validaciones para recuperación de contraseña
const forgotPasswordValidation = validateEmail();

// Validaciones para resetear contraseña
const resetPasswordValidation = [
  ...validateToken(),
  ...validatePassword(8),
];

// Validaciones para cambiar contraseña
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  ...validatePassword(8),
];

// Rutas públicas
router.post(
  '/register',
  registerValidation,
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validateRequest,
  AuthController.login
);

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  forgotPasswordValidation,
  validateRequest,
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  AuthController.resetPassword
);

// Rutas protegidas
router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

router.post(
  '/logout',
  authenticateToken,
  AuthController.logout
);

router.put(
  '/change-password',
  authenticateToken,
  changePasswordValidation,
  validateRequest,
  AuthController.changePassword
);

// Ruta de verificación de token
router.get(
  '/verify-token',
  authenticateToken,
  AuthController.verifyToken
);

export default router;
