import { Client } from '../models/client.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import clients from '../config/clients';

export class ClientService {
  private clients: Client[] = clients;

  // Método para verificar las credenciales del cliente
  async validateClient(clientId: string, secret: string): Promise<boolean> {
    const client = this.clients.find((c) => c.clientId === clientId);
    if (!client) {
      return false;
    }
    return bcrypt.compare(secret, client.secret);
  }

  // Método para generar un token JWT
  generateAccessToken(clientId: string): string {
    const payload = { clientId };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    return token;
  }
}

export const clientService = new ClientService(); 