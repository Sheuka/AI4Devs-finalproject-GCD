import createAxiosInstance from '../utils/axiosInstance';
import { Message } from '../types/assistant';

const axiosInstance = createAxiosInstance(import.meta.env.VITE_PROJECT_API_URL);

const createThread = async (): Promise<{ message: Message, idThread: string }> =>  {
    const response = await axiosInstance.post('/assistant/threads');
    return {
        message: {
            id: (Date.now() + 1).toString(),
            content: response.data.content,
            sender: 'assistant',
            timestamp: new Date()
        },
        idThread: response.data.threadId
    };
  };
  
  const processMessage = async (message: string, threadId: string): Promise<{ message: Message, isComplete: boolean }> => {
    const response = await axiosInstance.post(`/assistant/threads/${threadId}/messages`, {
      message
    });
    return {
        message: {
            id: (Date.now() + 1).toString(),
            content: response.data.content,
            sender: 'assistant',
            timestamp: new Date()
        },
        isComplete: response.data.isComplete
    };
  };

export default {
  createThread,
  processMessage,
};
