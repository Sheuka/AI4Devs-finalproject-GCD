import { Request, Response } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { generateTestToken } from '../setup';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('debería permitir acceso con token válido', () => {
    const token = generateTestToken('123');
    mockRequest.headers = {
      authorization: `Bearer ${token}`
    };

    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
  });

  it('debería rechazar peticiones sin token', () => {
    authenticateToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Token no proporcionado'
    });
  });
});
