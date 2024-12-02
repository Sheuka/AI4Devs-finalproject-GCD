import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';
import assistantService from '../services/assistantService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const CreateProjectPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [threadId, setThreadId] = useState('');
  
  const chatRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createThread = async () => {
      const res = await assistantService.createThread();
      setThreadId(res.idThread);
      setMessages(prev => [...prev, res.message]);
    };
    createThread();
  }, []);

  useEffect(() => {
    // Scroll al último mensaje
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API de OpenAI
      const res = await assistantService.processMessage(inputMessage, threadId);
      setIsProjectCreated(res.isComplete);
      setMessages(prev => [...prev, res.message]);
    } catch (error) {
      toast.error('Error procesando mensaje.');
    } finally {
      setIsLoading(isProjectCreated);
    }
  };

  useEffect(() => {
    if (isProjectCreated) {
      toast.success('Proyecto creado exitosamente.');
      new Promise(resolve => setTimeout(resolve, 5000));
      navigate('/projects');
    }
  }, [isProjectCreated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu Proyecto</h1>
          <p className="text-gray-600 mb-6">
            Usa nuestro asistente inteligente para describir tu proyecto de manera clara y precisa.
          </p>

          {/* Chat Messages */}
          <div 
            ref={chatRef}
            className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg"
          >
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <FaRobot className="inline-block mr-2 text-primary" />
                  )}
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectPage;
