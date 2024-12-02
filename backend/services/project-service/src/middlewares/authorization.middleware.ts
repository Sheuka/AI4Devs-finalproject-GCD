import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth.types';

/**
 * Middleware de autorización que verifica si el usuario tiene uno de los roles permitidos.
 * @param allowedRoles - Array de roles permitidos.
 */
const authorize = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado: no tienes los permisos necesarios.' });
        }

        return next();
    };
};

export default authorize; 