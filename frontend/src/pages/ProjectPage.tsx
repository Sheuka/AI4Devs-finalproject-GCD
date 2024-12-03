import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTimes, FaCheck, FaComments } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';
import { ClientProject } from '../types/project';
import ConfirmModal from '../components/ConfirmModal';
import userService from '../services/userService';
import Chat from '../components/Chat';
import StarRating from '../components/StarRating'; // Importar el componente StarRating

interface ProfessionalInfo {
  name: string;
  photoUrl: string;
  rating: number;
  phone: string;
}

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    quoteId: string;
    action: 'accept' | 'reject';
  } | null>(null);

  const [professionalsInfo, setProfessionalsInfo] = useState<Record<string, ProfessionalInfo>>({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('ID del proyecto no proporcionado');
        }
        
        const data = await projectService.getProject(id);
        setProject(data);
        
        const professionalIds = Array.from(new Set(data.quotes.map(quote => quote.professionalId)));
        const idsToFetch = professionalIds.filter(pid => !professionalsInfo[pid]);
        
        const fetchProfessionalInfo = idsToFetch.map(async (pid) => {
          try {
            const professional = await userService.getUser(pid);
            setProfessionalsInfo(prev => ({
              ...prev,
              [pid]: {
                name: professional.firstName + ' ' + professional.lastName,
                photoUrl: professional.profilePicture || '',
                rating: professional.rating || 0,
                phone: professional.phoneNumber || '',
              }
            }));
          } catch (err) {
            console.error(`Error al obtener información del profesional con ID ${pid}:`, err);
          }
        });
        
        await Promise.all(fetchProfessionalInfo);
        
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al cargar el proyecto';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleQuoteAction = async (quoteId: string, action: 'accept' | 'reject') => {
    try {
      if (!project || !id) {
        throw new Error('Información del proyecto no disponible');
      }
      
      const response = await projectService.updateQuoteStatus(id, quoteId, action);
      
      setProject(response);
      
      toast.success(`Presupuesto ${action === 'accept' ? 'aceptado' : 'rechazado'} correctamente`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al procesar el presupuesto';
      toast.error(message);
    }
  };

  const handleConfirm = () => {
    if (currentAction) {
      handleQuoteAction(currentAction.quoteId, currentAction.action);
      setModalVisible(false);
      setCurrentAction(null);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCurrentAction(null);
  };

  const getStatusColor = (status: ClientProject['status']) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      closed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {error || 'Proyecto no encontrado'}
          </h2>
        </div>
      </div>
    );
  }

  const hasAcceptedQuote = project.quotes.some(quote => quote.status === 'accepted');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Encabezado del Proyecto */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <span className={`mt-3 inline-block px-4 py-2 rounded-md text-base font-semibold ${getStatusColor(project.status)}`}>
                {project.status === 'open' && 'Abierto'}
                {project.status === 'in_progress' && 'En Progreso'}
                {project.status === 'completed' && 'Completado'}
                {project.status === 'closed' && 'Cerrado'}
              </span>
            </div>
            {project.status === 'open' && (
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-secondary transition-colors"
            >
              <FaEdit className="mr-2" />
              Editar
            </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detalles del Proyecto */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Detalles del Proyecto</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                  <p className="mt-1 text-gray-900">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Presupuesto Estimado</h3>
                    <p className="mt-1 text-gray-900">{project.budget}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha de Creación</h3>
                    <p className="mt-1 text-gray-900">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Presupuestos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Presupuestos Recibidos</h2>
              <div className="overflow-x-auto">
                {project.quotes && project.quotes.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesional
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {project.quotes.map((quote) => (
                        <tr key={quote.quoteId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {professionalsInfo[quote.professionalId] && (
                              <div className="flex items-center space-x-2">
                                <img
                                  src={professionalsInfo[quote.professionalId].photoUrl}
                                  alt={professionalsInfo[quote.professionalId].name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {professionalsInfo[quote.professionalId].name}
                                  </p>
                                  <p className="text-xs text-gray-600 flex items-center">
                                    Rating:
                                    <StarRating rating={professionalsInfo[quote.professionalId].rating} />
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Tel: {professionalsInfo[quote.professionalId].phone}
                                  </p>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ${quote.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {quote.status !== 'accepted' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setCurrentAction({ quoteId: quote.quoteId, action: 'accept' });
                                    setModalVisible(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentAction({ quoteId: quote.quoteId, action: 'reject' });
                                    setModalVisible(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No hay presupuestos disponibles para este proyecto.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chat (Condicional) */}
          {project.status === 'in_progress' && hasAcceptedQuote && (
            <div className="lg:col-span-1">
              <Chat projectId={project.id} />
            </div>
          )}
        </div>
      </main>
      {modalVisible && currentAction && (
        <ConfirmModal
          isOpen={modalVisible}
          title={`Confirmar ${currentAction.action === 'accept' ? 'Aceptación' : 'Rechazo'}`}
          message={`¿Estás seguro de que deseas ${currentAction.action === 'accept' ? 'aceptar' : 'rechazar'} este presupuesto?`}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default ProjectPage; 