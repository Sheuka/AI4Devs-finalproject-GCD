import bcrypt from 'bcryptjs';
import { Client } from '../models/client.model';

// Lista de clientes con secretos en texto plano
const rawClients: { clientId: string; secret: string }[] = [
  {
    clientId: 'project-manager',
    secret: 'project-manager-secret',
  },
  {
    clientId: 'user-service',
    secret: 'user-service-secret',
  },
  // Agrega más clientes según sea necesario
];

// Función para hashear los secretos de los clientes
const hashedClients: Client[] = rawClients.map(client => ({
  clientId: client.clientId,
  secret: bcrypt.hashSync(client.secret, 10),
}));

export default hashedClients; 