import sgMail from '@sendgrid/mail';
import { config } from '../config';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${config.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>Este enlace expirará en 2 horas.</p>
      `
    };

    try {
      await sgMail.send(mailOptions);
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar el email de recuperación de contraseña');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
      to: email,
      subject: `¡Bienvenido a ${config.APP_NAME}!`,
      html: `
        <h1>¡Bienvenido ${firstName}!</h1>
        <p>Gracias por registrarte en ${config.APP_NAME}.</p>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      `
    };

    try {
      await sgMail.send(mailOptions);
    } catch (error) {
      console.error('Error al enviar email de bienvenida:', error);
      // No lanzamos error para no interrumpir el flujo de registro
    }
  }
}

export const emailService = new EmailService();
