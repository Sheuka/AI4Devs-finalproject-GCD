import { Request, Response, NextFunction } from 'express';
import { createThread, processMessage } from '../services/assistantService';

/**
 * Controlador para procesar mensajes del asistente.
 */
export const processMessageHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { threadId } = req.params;
    const { message } = req.body;
    
    const response = await processMessage({
      threadId,
      message,
      userId: req.user.userId
    });
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createThreadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await createThread(req.user.userId);
    res.status(201).json(thread);
  } catch (error) {
    next(error);
  }
};
