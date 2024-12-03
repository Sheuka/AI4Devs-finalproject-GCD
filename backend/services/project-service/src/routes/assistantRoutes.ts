import { Router } from 'express';
import { createThreadHandler, processMessageHandler } from '../controllers/assistantController';
import authenticate from '../middlewares/authentication.middleware';
import authorize from '../middlewares/authorization.middleware';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';
import { UserRole } from '../types/auth.types';

const router = Router();

router.use(authenticate);

router.post(
  '/threads',
  authorize([UserRole.CLIENT]),
  validateRequest,
  createThreadHandler
);

router.post(
  '/threads/:threadId/messages',
  authorize([UserRole.CLIENT]),
  [
    body('message').isString().notEmpty().withMessage('El mensaje es obligatorio'),
  ],
  validateRequest,
  processMessageHandler
);

export default router;
