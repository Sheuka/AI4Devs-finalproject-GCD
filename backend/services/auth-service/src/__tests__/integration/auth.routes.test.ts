import request from 'supertest';
import app from '../../app';
import { testUser } from '../fixtures/users';
import { EmailService } from '../../services/email.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AuthenticationError } from '../../utils/errors';

// Mockear servicios
jest.mock('../../services/email.service');
jest.mock('../../services/user.service');
jest.mock('../../services/auth.service');

const mockedEmailService = EmailService as jest.MockedClass<typeof EmailService>;
const mockedUserService = UserService as jest.MockedClass<typeof UserService>;
const mockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

const password = "Password123";

describe('Rutas de Autenticación', () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen(4000);
  });

  afterAll(async () => {
    server.close();
  });

  beforeEach(async () => {
    // Resetear los mocks
    jest.clearAllMocks();
    AuthService.clearResetTokensMap();

    // Configurar comportamiento por defecto del UserService
    mockedUserService.prototype.findByEmail.mockResolvedValue(null);
    mockedUserService.prototype.create.mockResolvedValue(testUser);
    mockedUserService.prototype.findById.mockResolvedValue(testUser);
  });

  const registerUser = async (user = testUser) => {
    return await request(app)
      .post('/api/auth/register')
      .send({ ...user, password });
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
      mockedUserService.prototype.findByEmail.mockResolvedValue(testUser);
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password
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
      mockedUserService.prototype.findByEmail.mockResolvedValue(testUser);
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Se ha enviado un email con las instrucciones para recuperar la contraseña');
    });

    it('debería rechazar solicitudes con email no registrado', async () => {
      mockedUserService.prototype.findByEmail.mockResolvedValue(null);
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
      mockedUserService.prototype.findByEmail.mockResolvedValue(testUser);
    });

    it('debería resetear la contraseña correctamente', async () => {
      // Mockear el método de envío de email para capturar el token
      let capturedToken: string | null = null;
      mockedEmailService.prototype.sendPasswordResetEmail.mockImplementation(async (_email, token) => {
        capturedToken = token;
      });

      // Solicitar restablecimiento de contraseña
      const responseForgot = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

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
    });

    it('debería rechazar resetear con token inválido', async () => {
      mockedAuthService.prototype.verifyPasswordResetToken.mockRejectedValue(new AuthenticationError('Token inválido'));
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'tokenInválido',
          password: 'nuevaContraseña123'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });

    it('debería rechazar resetear con token expirado', async () => {
      mockedAuthService.prototype.verifyPasswordResetToken.mockRejectedValue(new AuthenticationError('Token expirado'));
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          token: 'expired-token', 
          password: 'nuevaContraseña123' 
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Token expirado');
    }); 
  });
});
