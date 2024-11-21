import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CreateUserDTO, UserResponse } from '../models/user.model';
import { config } from '../config';
import { AccessTokenPayload } from '../types/auth.types';

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export class UserService {
  private authToken: string;  

  constructor() {
    this.authToken = this.getAuthToken();
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/email/${email}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      return response.data.user;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error('Error al comunicarse con el User Service');
    }
  }

  async findById(id: string): Promise<UserResponse | null> {
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      return response.data.user;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error('Error al comunicarse con el User Service');
    }
  }

  async create(userData: CreateUserDTO): Promise<UserResponse> {
    try {
      const response = await axios.post(`${USER_SERVICE_URL}/register`, userData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      return response.data.user;
    } catch (error: any) {
      throw new Error('Error al comunicarse con el User Service para crear usuario');
    }
  }

  async update(id: string, updateData: Partial<UserResponse>): Promise<UserResponse> {
    try {
      const response = await axios.put(`${USER_SERVICE_URL}/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      return response.data.user;
    } catch (error: any) {
      throw new Error('Error al comunicarse con el User Service para actualizar usuario');
    }
  }

  private getAuthToken(): string {
    const tokenPayload: AccessTokenPayload = {
      clientId: config.APP_NAME,
      iat: Date.now(),
      exp: Date.now() + 3600000, // 1 hora
    }

    const token = jwt.sign(tokenPayload, config.USER_SERVICE_JWT_SECRET);

    return token;
  }
}
