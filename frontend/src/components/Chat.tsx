import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaUserAlt } from 'react-icons/fa';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';
import { Message } from '../types/project';
import useAuth from '../hooks/useAuth';


interface ChatProps {
  projectId: string;
}

const Chat: React.FC<ChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Cargar mensajes iniciales del proyecto
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await projectService.getChatMessages(projectId);
        fetchedMessages.forEach(message => {
          if (message.userId === user?.userId) {
            message.sender = 'LOCAL';
          } else {
            message.sender = 'REMOTE';
          }
        });
        setMessages(fetchedMessages);
      } catch (error) {
        toast.error('Error al cargar los mensajes del chat.');
      }
    };
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    // Scroll al último mensaje
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const localMessage: Message = {
      id: Date.now().toString(),
      projectId,
      userId: user?.userId || '',
      content: inputMessage,
      sender: 'LOCAL',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, localMessage]);
    setInputMessage('');

    try {
      await projectService.sendMessage(projectId, inputMessage);      
    } catch (error) {
      toast.error('Error al enviar el mensaje.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-[500px] flex flex-col bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'LOCAL' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.sender === 'LOCAL' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {message.sender === 'REMOTE' && <FaUserAlt className="inline-block mr-2" />}
              {message.sender === 'LOCAL' && <FaUser className="inline-block mr-2" />}
              {message.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-md border-gray-300 focus:border-primary focus:ring-primary px-3 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 