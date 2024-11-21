import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { generateTestToken } from '../setup';
import { testCreateUser, responseUser, testUpdateUser } from '../fixtures/users';
import * as dependencies from '../../config/dependencies';
import { UserService } from '../../services/user.service';

// Mock PrismaClient
jest.mock('@prisma/client');

describe('User Routes', () => {
  let server: any;
  let prismaClient: jest.Mocked<PrismaClient>;
  let userService: UserService;

  beforeAll(() => {
    jest.clearAllMocks();
    
    prismaClient = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaClient>;

    (PrismaClient as jest.Mock).mockImplementation(() => prismaClient);
  });

  beforeEach(() => {
    // Configurar las dependencias antes de inicializar el controlador
    dependencies.setPrismaClient(prismaClient);
    userService = new UserService();
    dependencies.setUserService(userService);
    
    // Inicializar el servidor después de configurar las dependencias
    if (!server) {
      server = app.listen(4001);
    }
  });

  afterAll(() => {
    server?.close();
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(responseUser);
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .get(`/api/users/${responseUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(expect.objectContaining({
        email: responseUser.email,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName
      }));
    });

    it('debería retornar 401 sin token', async () => {
      const response = await request(app)
        .get(`/api/users/${responseUser.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debería actualizar un usuario', async () => {
      const userToUpdate = { ...testUpdateUser };
      const updatedUser = { ...responseUser, ...userToUpdate };
      (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .put(`/api/users/${responseUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(userToUpdate);

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe(userToUpdate.firstName);
    });

    it('debería validar los datos de actualización', async () => {
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .put(`/api/users/${responseUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/users/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const userToCreate = { ...testCreateUser };
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaClient.user.create as jest.Mock).mockResolvedValue(responseUser);
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .post('/api/users/register')
        .set('Authorization', `Bearer ${token}`)
        .send(userToCreate);

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(expect.objectContaining({
        email: responseUser.email,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName
      }));
    });

    it('debería validar los datos de registro', async () => {
      const token = generateTestToken(responseUser.id);
      const invalidUser = { email: 'invalid-email' };

      const response = await request(app)
        .post('/api/users/register')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidUser);

      expect(response.status).toBe(400);
    });

    it('debería prevenir registro de email duplicado', async () => {
      const token = generateTestToken(responseUser.id);
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(responseUser);

      const response = await request(app)
        .post('/api/users/register')
        .set('Authorization', `Bearer ${token}`)
        .send(testCreateUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('El correo electrónico ya está registrado');
    });
  });

  describe('GET /api/users/email/:email', () => {
    it('debería obtener un usuario por email', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(responseUser);
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .get(`/api/users/email/${responseUser.email}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(expect.objectContaining({
        email: responseUser.email
      }));
    });

    it('debería retornar 404 si el email no existe', async () => {
      (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .get('/api/users/email/noexiste@example.com')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('debería validar formato de email', async () => {
      const token = generateTestToken(responseUser.id);

      const response = await request(app)
        .get('/api/users/email/invalid-email')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });
});
