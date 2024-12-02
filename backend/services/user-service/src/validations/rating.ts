import { body } from 'express-validator';

// Funciones reutilizables para validaciones
export const validateRating = () => [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe ser un número entre 1 y 5'),
    body('userId')
      .isUUID()
      .withMessage('El ID del usuario proporcionado no es válido'),
  ];