import { Request, Response } from 'express';
import { CreateProfessionalDTO, UpdateProfessionalDTO } from '../models/professional.model'
import { ProfessionalService } from '../services/professional.service';
import { getProfessionalService, getUserService } from '../config/dependencies';
import bcrypt from 'bcryptjs';

export class ProfessionalController {
  private professionalService: ProfessionalService;

  constructor() {
    this.professionalService = getProfessionalService();
  }

  getAll = async (_req: Request, res: Response) => {
    try {
      const professionals = await this.professionalService.findAll();
      res.json(professionals);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const professional = await this.professionalService.findById(id);
      if (!professional) {
        res.status(404).json({ message: 'Profesional no encontrado' });
        return;
      }
      res.json(professional);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data: CreateProfessionalDTO = req.body;
      const userService = getUserService();
      const existingUser = await userService.findByEmail(data.email);

      if (existingUser) {
        res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const professional = await this.professionalService.create({
        ...data,
        password: hashedPassword,
      });
      
      res.status(201).json(professional);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data: UpdateProfessionalDTO = req.body;
      const updatedProfessional = await this.professionalService.update(id, data);
      if (!updatedProfessional) {
        return res.status(404).json({ message: 'Profesional no encontrado' });
      }
      return res.json(updatedProfessional);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  };

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedProfessional = await this.professionalService.toggleStatus(id);
      if (!updatedProfessional) {
        return res.status(404).json({ message: 'Profesional no encontrado' });
      }
      return res.json(updatedProfessional);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedProfessional = await this.professionalService.delete(id);
      if (!deletedProfessional) {
        return res.status(404).json({ message: 'Profesional no encontrado' });
      }
      return res.json({ message: 'Profesional eliminado con éxito' });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  };
}

// Crear una instancia del controlador
const professionalController = new ProfessionalController();

// Exportar los métodos del controlador
export const { getAll, getById, create, update, toggleStatus, delete: deleteProfessional } = professionalController; 