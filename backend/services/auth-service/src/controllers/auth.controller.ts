import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { emailService } from '../services/email.service';

// Instanciar servicios
const userService = new UserService();
const authService = new AuthService(userService);

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      isActive: true,
      lastLogin: null,
      phoneNumber: null,
      profilePicture: null
    });

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      message: 'Error al registrar usuario'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      message: 'Error al iniciar sesión'
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      });
    }
    const userId = req.user.userId;
    const user = await userService.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({
      message: 'Error al obtener información del usuario'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userService.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Generar token de recuperación
    const resetToken = await authService.generatePasswordResetToken(user.id);

    // Aquí deberías enviar el email con el token
    await emailService.sendPasswordResetEmail(email, resetToken);

    return res.json({
      message: 'Se ha enviado un email con las instrucciones para recuperar la contraseña'
    });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    return res.status(500).json({
      message: 'Error al procesar la solicitud de recuperación de contraseña'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    
    // Verificar token y obtener usuario
    const user = await authService.verifyPasswordResetToken(token);
    if (!user) {
      return res.status(400).json({
        message: 'Token inválido o expirado'
      });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await userService.updatePassword(user.id, hashedPassword);

    return res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    return res.status(500).json({
      message: 'Error al restablecer la contraseña'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      });
    }
    const userId = req.user.userId;
    const { currentPassword, password } = req.body;

    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await userService.updatePassword(userId, hashedPassword);

    return res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({
      message: 'Error al cambiar la contraseña'
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    // Aquí podrías implementar lógica adicional como invalidar el token
    // o removerlo de una lista blanca/negra si las usas
    
    return res.json({
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({
      message: 'Error al cerrar sesión'
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  // Si llegamos aquí, significa que el token es válido (gracias al middleware authenticateToken)
  res.json({
    valid: true,
    user: req.user
  });
};
