import { UserRole } from '@prisma/client';
import { param, body } from 'express-validator';

// Funciones reutilizables para validaciones
export const validateId = () => [
    param('id')
      .isUUID()
      .withMessage('El ID proporcionado no es válido'),
  ];
  
export const validateEmail = () => [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Debe proporcionar un email válido'),
  ];
  
export const validatePassword = (minLength: number) => [
    body('password')
      .optional()
      .isLength({ min: minLength })
      .withMessage(`La contraseña debe tener al menos ${minLength} caracteres`)
      .matches(/\d/)
      .withMessage('La contraseña debe contener al menos un número'),
  ];
  
export const validateName = (field: string) => [
    body(field)
      .optional()
      .notEmpty()
      .withMessage(`El ${field} no puede estar vacío`),
  ];
  
export const validateRole = () => [
    body('role')
      .optional()
      .isIn([UserRole.CLIENT, UserRole.PROFESSIONAL])
      .withMessage(`El rol debe ser ${UserRole.CLIENT} o ${UserRole.PROFESSIONAL}`),
  ];
  
export const validateProvince = () => [
    body('province')
      .optional()
      .isString()
      .withMessage('La provincia debe ser una cadena de texto'),
  ];
  
export const validateLocality = () => [
    body('locality')
      .optional()
      .isString()
      .withMessage('La localidad debe ser una cadena de texto'),
  ];