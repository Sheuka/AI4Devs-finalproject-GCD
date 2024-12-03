import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3003),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // OpenAI
  OPENAI_API_KEY: Joi.string().required(),
  OPENAI_ASSISTANT_ID: Joi.string().required(),

  // Email
  SMTP_FROM: Joi.string().required(),
  SENDGRID_API_KEY: Joi.string().required(),

  // App
  APP_NAME: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),

  // Auth
  AUTH_SERVICE_URL: Joi.string().required(),
  AUTH_CLIENT_ID: Joi.string().required(),
  AUTH_CLIENT_SECRET: Joi.string().required(),

  // User
  USER_SERVICE_URL: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Error de validación de configuración: ${error.message}`);
}

export const config = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,

  // Database
  DATABASE_URL: envVars.DATABASE_URL,

  // JWT
  JWT_SECRET: envVars.JWT_SECRET,

  // OpenAI
  OPENAI_API_KEY: envVars.OPENAI_API_KEY,
  OPENAI_ASSISTANT_ID: envVars.OPENAI_ASSISTANT_ID,

  // Email
  SMTP_FROM: envVars.SMTP_FROM,
  SENDGRID_API_KEY: envVars.SENDGRID_API_KEY,

  // App
  APP_NAME: envVars.APP_NAME,
  CLIENT_URL: envVars.CLIENT_URL,

  // Auth
  AUTH_SERVICE_URL: envVars.AUTH_SERVICE_URL,
  AUTH_CLIENT_ID: envVars.AUTH_CLIENT_ID,
  AUTH_CLIENT_SECRET: envVars.AUTH_CLIENT_SECRET,

  // User
  USER_SERVICE_URL: envVars.USER_SERVICE_URL,
};
