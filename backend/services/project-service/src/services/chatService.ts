import { PrismaClient } from '@prisma/client';
import { ChatMessageResponseDTO } from '../types/project.types';

const prisma = new PrismaClient();

/**
 * Obtiene los mensajes de chat asociados a un proyecto.
 * @param projectId - ID del proyecto.
 * @returns Lista de mensajes de chat.
 */
export const getChatMessagesByProjectId = async (projectId: string): Promise<ChatMessageResponseDTO[]> => {
  const messages = await prisma.chatMessage.findMany({
    where: { project_id: projectId },
    orderBy: { timestamp: 'asc' },
  });
  const chatMessages = messages.map((message) => ({
    id: message.id,
    projectId: message.project_id,
    userId: message.user_id,
    content: message.content,
    timestamp: message.timestamp,
  }));
  return chatMessages;
};

/**
 * Envia un mensaje a un proyecto.
 * @param projectId - ID del proyecto.
 * @param userId - ID del usuario.
 * @param content - Contenido del mensaje.
 */ 
export const sendChatMessage = async (projectId: string, userId: string, content: string): Promise<ChatMessageResponseDTO> => {
  const message = await prisma.chatMessage.create({
    data: { project_id: projectId, user_id: userId, content },
  });
  const chatMessage = {
    id: message.id,
    projectId: message.project_id,
    userId: message.user_id,
    content: message.content,
    timestamp: message.timestamp,
  };
  return chatMessage;
};

