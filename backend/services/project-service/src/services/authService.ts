import axios from 'axios';
import { config } from '../config';

/**
 * Obtiene el TOKEN de autorización desde el servicio de autorización.
 */
export const getAuthToken = async (): Promise<string> => {
    try {
        const response = await axios.post(`${config.AUTH_SERVICE_URL}/api/auth/token`, {
            clientId: config.AUTH_CLIENT_ID,
            secret: config.AUTH_CLIENT_SECRET,
        });
        return response.data.token;
    } catch (error) {
        console.error('Error al obtener el token de autorización:', error);
        throw new Error('No se pudo obtener el token de autorización');
    }
};