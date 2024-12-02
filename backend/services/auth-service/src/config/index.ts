import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  USER_SERVICE_URL: Joi.string().uri().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  PASSWORD_RESET_TOKEN_EXPIRATION_HOURS: Joi.number().default(1),

  // Email
  SMTP_FROM: Joi.string().email().required(),
  SENDGRID_API_KEY: Joi.string().required(),
  
  // App
  APP_NAME: Joi.string().required(),
  CLIENT_URL: Joi.string().uri().required(),

  // Clave secreta para JWT inter-servicios
  USER_SERVICE_JWT_SECRET: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Error de validación de configuración: ${error.message}`);
}

export const config = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,

  USER_SERVICE_URL: envVars.USER_SERVICE_URL,

  // JWT
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
  PASSWORD_RESET_TOKEN_EXPIRATION_HOURS: envVars.PASSWORD_RESET_TOKEN_EXPIRATION_HOURS,

  // SMTP
  SMTP_FROM: envVars.SMTP_FROM,
  SENDGRID_API_KEY: envVars.SENDGRID_API_KEY,

  // App
  APP_NAME: envVars.APP_NAME,
  CLIENT_URL: envVars.CLIENT_URL,

  // Clave secreta para JWT inter-servicios
  USER_SERVICE_JWT_SECRET: envVars.USER_SERVICE_JWT_SECRET,
};
