import sgMail from '@sendgrid/mail';
import { config } from '../config';
import { ProjectResponseDTO } from '../types/project.types';
import { QuoteResponseDTO } from '../types/quote.types';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export class EmailService {
    constructor() {
        // Inicialización si es necesario
    }

    /**
     * Envía un correo a los profesionales cuando se crea un nuevo proyecto.
     * @param email - Correo del profesional.
     * @param project - Detalles del proyecto.
     */
    async sendNewProjectEmail(email: string, project: ProjectResponseDTO): Promise<void> {
        const resetUrl = `${config.CLIENT_URL}/login`;

        const mailOptions = {
            from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
            to: email,
            subject: 'Nuevo Proyecto Disponible',
            html: `
                <h1>Nuevo Proyecto: ${project.title}</h1>
                <p><strong>Descripción:</strong> ${project.description}</p>
                <p><strong>Tipo:</strong> ${project.type}</p>
                <p><strong>Monto:</strong> ${project.amount}</p>
                <p><strong>Presupuesto:</strong> ${project.budget}</p>
                <p><strong>Fecha de Inicio:</strong> ${new Date(project.startDate).toLocaleDateString()}</p>
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
                    Iniciar Sesión
                </a>
                <p>Visita la plataforma para más detalles del proyecto.</p>
            `
        };

        try {
            await sgMail.send(mailOptions);
            console.log(`Correo enviado a ${email} sobre el nuevo proyecto ${project.title}`);
        } catch (error) {
            console.error(`Error al enviar correo a ${email}:`, error);
            // Manejo adicional del error si es necesario
            throw new Error('Error al enviar el correo de nuevo proyecto');
        }
    }

    /**
     * Envía un correo al cliente cuando se crea un nuevo presupuesto.
     * @param email - Correo del cliente.
     * @param project - Detalles del proyecto.
     * @param quote - Detalles del presupuesto.
     */
    async sendQuoteCreatedEmail(email: string, projectTitle: string, quote: QuoteResponseDTO): Promise<void> {
        const resetUrl = `${config.CLIENT_URL}/login`;

        const mailOptions = {
            from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
            to: email,
            subject: 'Nuevo Presupuesto Enviado',
            html: `
                <h1>Presupuesto para Proyecto: ${projectTitle}</h1>
                <p><strong>Monto:</strong> ${quote.amount}</p>
                <p><strong>Mensaje:</strong> ${quote.message ?? 'Sin mensaje'}</p>
                <p><strong>Tiempo Estimado:</strong> ${quote.estimatedDuration ?? 'N/A'}</p>
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
                    border-radius: 4px;
                ">
                    Ver Presupuesto
                </a>
            `
        };

        try {
            await sgMail.send(mailOptions);
            console.log(`Correo de presupuesto enviado a ${email} para el proyecto ${projectTitle}`);
        } catch (error) {
            console.error(`Error al enviar correo de presupuesto a ${email}:`, error);
            throw new Error('Error al enviar el correo de presupuesto');
        }
    }

    /**
     * Envía un correo al cliente cuando se actualiza un presupuesto existente.
     * @param email - Correo del cliente.
     * @param project - Detalles del proyecto.
     * @param quote - Detalles del presupuesto actualizado.
     */
    async sendQuoteUpdatedEmail(email: string, projectTitle: string, quote: QuoteResponseDTO): Promise<void> {
        const resetUrl = `${config.CLIENT_URL}/login`;

        const mailOptions = {
            from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
            to: email,
            subject: 'Presupuesto Actualizado',
            html: `
                <h1>Actualización de Presupuesto para Proyecto: ${projectTitle}</h1>
                <p><strong>Monto:</strong> ${quote.amount}</p>
                <p><strong>Mensaje:</strong> ${quote.message ?? 'Sin mensaje'}</p>
                <p><strong>Tiempo Estimado:</strong> ${quote.estimatedDuration ?? 'N/A'}</p>
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
                    border-radius: 4px;
                ">
                    Ver Presupuesto Actualizado
                </a>
            `
        };

        try {
            await sgMail.send(mailOptions);
            console.log(`Correo de presupuesto actualizado enviado a ${email} para el proyecto ${projectTitle}`);
        } catch (error) {
            console.error(`Error al enviar correo de presupuesto actualizado a ${email}:`, error);
            throw new Error('Error al enviar el correo de presupuesto actualizado');
        }
    }

    /**
     * Envía un correo al profesional cuando su presupuesto ha sido aceptado.
     * @param email - Correo del profesional.
     * @param projectTitle - Título del proyecto.
     * @param quote - Detalles del presupuesto.
     */
    async sendQuoteAcceptedEmail(email: string, projectTitle: string, quote: QuoteResponseDTO): Promise<void> {
        const resetUrl = `${config.CLIENT_URL}/login`;

        const mailOptions = {
            from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
            to: email,
            subject: 'Presupuesto Aceptado',
            html: `
                <h1>Presupuesto Aceptado para el Proyecto: ${projectTitle}</h1>
                <p><strong>Monto:</strong> ${quote.amount}</p>
                <p><strong>Mensaje:</strong> ${quote.message ?? 'Sin mensaje'}</p>
                <p><strong>Tiempo Estimado:</strong> ${quote.estimatedDuration ?? 'N/A'}</p>
                <p>Tu presupuesto ha sido aceptado por el cliente.</p>
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
                    border-radius: 4px;
                ">
                    Ver Proyecto
                </a>
            `
        };

        try {
            await sgMail.send(mailOptions);
            console.log(`Correo de presupuesto aceptado enviado a ${email} para el proyecto ${projectTitle}`);
        } catch (error) {
            console.error(`Error al enviar correo de presupuesto aceptado a ${email}:`, error);
            throw new Error('Error al enviar el correo de presupuesto aceptado');
        }
    }

    /**
     * Envía un correo al profesional cuando su presupuesto ha sido rechazado.
     * @param email - Correo del profesional.
     * @param projectTitle - Título del proyecto.
     * @param quote - Detalles del presupuesto.
     */
    async sendQuoteRejectedEmail(email: string, projectTitle: string, quote: QuoteResponseDTO): Promise<void> {
        const resetUrl = `${config.CLIENT_URL}/login`;

        const mailOptions = {
            from: `"${config.APP_NAME}" <${config.SMTP_FROM}>`,
            to: email,
            subject: 'Presupuesto Rechazado',
            html: `
                <h1>Presupuesto Rechazado para el Proyecto: ${projectTitle}</h1>
                <p><strong>Monto:</strong> ${quote.amount}</p>
                <p><strong>Mensaje:</strong> ${quote.message ?? 'Sin mensaje'}</p>
                <p><strong>Tiempo Estimado:</strong> ${quote.estimatedDuration ?? 'N/A'}</p>
                <p>Tu presupuesto ha sido rechazado por el cliente.</p>
                <a href="${resetUrl}" style="
                    background-color: #f44336;
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                ">
                    Ver Proyecto
                </a>
            `
        };

        try {
            await sgMail.send(mailOptions);
            console.log(`Correo de presupuesto rechazado enviado a ${email} para el proyecto ${projectTitle}`);
        } catch (error) {
            console.error(`Error al enviar correo de presupuesto rechazado a ${email}:`, error);
            throw new Error('Error al enviar el correo de presupuesto rechazado');
        }
    }

    // ... Otras funciones existentes
}

export const emailService = new EmailService();
