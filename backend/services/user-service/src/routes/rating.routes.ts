import { Router } from 'express';
import * as RatingController from '../controllers/rating.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { validateRating } from '../validations/rating';
import authenticate from '../middlewares/auth.middleware';
const router = Router();

router.post(
    '/',
    authenticate,
    validateRating(),
    validateRequest,
    RatingController.create
  );

export default router;
