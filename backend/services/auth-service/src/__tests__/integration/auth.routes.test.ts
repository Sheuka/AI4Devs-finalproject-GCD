import request from 'supertest';
import app from '../../app';
import { testUser } from '../fixtures/users';
import { prisma } from '../../lib/prisma';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';

// Mockear el servicio de email
jest.mock('../../services/email.service');

const mockedEmailService = EmailService as jest.MockedClass<typeof EmailService>;

describe('Rutas de Autenticación', () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen(4000);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  beforeEach(async () => {
    // Eliminar todos los usuarios antes de cada prueba
    await prisma.user.deleteMany();

    // Resetear los mocks
    jest.clearAllMocks();

    // Limpiar el resetTokensMap
    AuthService.clearResetTokensMap();
  });

  const registerUser = async (user = testUser) => {
    return await request(app)
      .post('/api/auth/register')
      .send(user);
  };

  describe('POST /api/auth/register', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const response = await registerUser();

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('debería fallar al registrar con campos requeridos faltantes', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('debería fallar al registrar con un rol inválido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          role: 'INVALID_ROLE'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await registerUser();
    });

    it('debería autenticar a un usuario válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('debería rechazar credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'contraseñaIncorrecta'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });

    it('debería rechazar inicio de sesión con email no registrado', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexistente@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await registerUser();
      token = registerResponse.body.token;
    });

    it('debería obtener el perfil del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('debería rechazar peticiones sin token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token no proporcionado');
    });

    it('debería rechazar peticiones con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer tokenInválido');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
        await registerUser();
    });

    it('debería iniciar el proceso de recuperación de contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Se ha enviado un email con las instrucciones para recuperar la contraseña');
    });

    it('debería rechazar solicitudes con email no registrado', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'noexistente@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    beforeEach(async () => {
        await registerUser();
    });
    it('debería resetear la contraseña correctamente', async () => {
      const validUser = await prisma.user.findUnique({ where: { email: testUser.email } });      
      expect(validUser).not.toBeNull();
      
      if (validUser) {
        // Mockear el método de envío de email para capturar el token
        let capturedToken: string | null = null;
        mockedEmailService.prototype.sendPasswordResetEmail.mockImplementation(async (_email, token) => {
          capturedToken = token;
        });

        // Solicitar restablecimiento de contraseña
        const responseForgot = await request(app)
          .post('/api/auth/forgot-password')
          .send({ email: validUser.email });

        expect(responseForgot.status).toBe(200);
        expect(responseForgot.body).toHaveProperty('message', 'Se ha enviado un email con las instrucciones para recuperar la contraseña');

        // Asegurar que el email fue enviado y capturar el token
        expect(mockedEmailService.prototype.sendPasswordResetEmail).toHaveBeenCalled();
        expect(capturedToken).not.toBeNull();

        if (capturedToken) {
          // Realizar el restablecimiento de contraseña con el token capturado
          const responseReset = await request(app)
            .post('/api/auth/reset-password')
            .send({
              token: capturedToken,
              password: 'nuevaContraseña123'
            });

          expect(responseReset.status).toBe(200);
          expect(responseReset.body).toHaveProperty('message', 'Contraseña actualizada exitosamente');
        }
      }
    });

    it('debería rechazar resetear con token inválido', async () => {
      const validUser = await prisma.user.findUnique({ where: { email: testUser.email } });        
      expect(validUser).not.toBeNull();

      if (validUser) {
        const response = await request(app)
          .post('/api/auth/reset-password')
          .send({
          token: 'tokenInválido',
          password: 'nuevaContraseña123'
      });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error al restablecer la contraseña');
      }
    });
  });

  describe('POST /api/auth/logout', () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await registerUser();
      token = registerResponse.body.token;
    });

    it('debería cerrar la sesión del usuario correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Sesión cerrada exitosamente');
    });

    it('debería rechazar logout sin token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token no proporcionado');
    });
  });

  describe('PUT /api/auth/change-password', () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await registerUser();
      token = registerResponse.body.token;
    });

    it('debería cambiar la contraseña correctamente', async () => {
      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          password: 'nuevaContraseña123'
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Contraseña actualizada exitosamente');
    });

    it('debería rechazar cambio de contraseña con contraseña actual incorrecta', async () => {
      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'contraseñaIncorrecta',
          password: 'nuevaContraseña123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Contraseña actual incorrecta');
    });

    it('debería rechazar cambio de contraseña sin autenticación', async () => {
      const response = await request(app)
        .put('/api/auth/change-password')
        .send({
          currentPassword: testUser.password,
          password: 'nuevaContraseña123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token no proporcionado');
    });
  });

  describe('GET /api/auth/verify-token', () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await registerUser();
      token = registerResponse.body.token;
    });

    it('debería verificar un token válido', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
    });

    it('debería rechazar verificación con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', 'Bearer tokenInválido');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });

    it('debería rechazar verificación sin token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token no proporcionado');
    });
  });
});
