import { Request, Response, NextFunction } from 'express';
import { getChatMessagesByProjectId, sendChatMessage } from '../services/chatService';

/**
 * Controlador para obtener mensajes de chat de un proyecto.
 */
export const getChatMessagesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const messages = await getChatMessagesByProjectId(projectId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para enviar un mensaje a un proyecto.
 */
export const sendChatMessageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const content = req.body.content;
    const message = await sendChatMessage(projectId, userId, content);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
