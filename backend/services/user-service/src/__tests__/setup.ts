import { config } from '../config';
import jwt from 'jsonwebtoken';

export const generateTestToken = (userId: string, role: string = 'CLIENT') => {
  return jwt.sign(
    { userId, role },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
};



