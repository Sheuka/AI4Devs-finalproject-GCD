import { config } from '../config';
import jwt from 'jsonwebtoken';

export const generateTestToken = (userId: string, role: string = 'client') => {
  return jwt.sign(
    { userId, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};
