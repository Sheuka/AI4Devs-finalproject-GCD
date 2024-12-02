import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { AuthenticationError } from '../utils/errors';
import { TokenPayload } from '../types/auth.types';
import { clientService } from '../services/client.service';

// Instanciar servicios
const userService = new UserService();
const emailService = new EmailService();
const authService = new AuthService(userService);

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await userService.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear el usuario
    const user = await userService.create({ ...userData, password: hashedPassword });

    // Enviar correo de bienvenida
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user
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

    // Buscar usuario en user-service
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

    const expiresIn = Date.now() + 3600000;

    // Generar token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      clientId: config.APP_NAME,
      iat: Date.now(),
      exp: expiresIn,
    }
    const token = jwt.sign(
      tokenPayload,
      config.JWT_SECRET
    );

    return res.json({
      token,
      expiresIn
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
      user
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

    // Enviar el email con el token
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

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await userService.update(user.id, { password: hashedPassword });

    return res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Error de autenticación al resetear contraseña:', error);
      return res.status(403).json({
        message: error.message
      });
    } else {
      console.error('Error al resetear contraseña:', error);
      return res.status(500).json({
        message: 'Error al restablecer la contraseña'
      });
    }
  }
};

export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const { clientId, secret } = req.body;

    if (!clientId || !secret) {
      return res.status(400).json({ message: 'clientId y secret son requeridos' });
    }

    const isValid = await clientService.validateClient(clientId, secret);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales de cliente inválidas' });
    }

    const token = clientService.generateAccessToken(clientId);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error al generar token de acceso:', error);
    return res.status(500).json({ message: 'Error al generar el token de acceso' });
  }
};

