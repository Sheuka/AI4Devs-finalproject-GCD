import { Request, Response } from 'express';
import { CreateUserDTO, UpdateUserDTO } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/user.service';
import { getUserService } from '../config/dependencies';

export class UserController {
  private _userService: UserService | null = null;

  private getUserService(): UserService {
    if (!this._userService) {
      this._userService = getUserService();
    }
    return this._userService;
  }

  register = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDTO = req.body;
      const userService = this.getUserService();
      
      const existingUser = await userService.findByEmail(userData.email);
      if (existingUser) {
        res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await userService.create({
        ...userData,
        password: hashedPassword
      });

      res.status(201).json({ user });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        message: 'Error al registrar usuario'
      });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userService = this.getUserService();
      const user = await userService.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json({ ...user });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        message: 'Error al obtener usuario'
      });
    }
  };

  getUserByEmail = async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const userService = this.getUserService();
      const user = await userService.findByEmail(email);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json({ user });
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      res.status(500).json({
        message: 'Error al obtener usuario por email'
      });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const updateData: UpdateUserDTO = req.body;
      const userService = this.getUserService();
      
      const updatedUser = await userService.update(userId, updateData);
      if (!updatedUser) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json({ user: updatedUser });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        message: 'Error al actualizar usuario'
      });
    }
  };
}

// Crear una instancia con el servicio por defecto
const userController = new UserController();

// Exportar los métodos del controlador
export const { register, getUserById, getUserByEmail, updateUser } = userController;
