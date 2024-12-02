import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import ProfessionalSidebar from '../../components/ProfessionalSidebar';
import Modal from '../../components/Modal';
import projectService from '../../services/projectService';
import { ProfessionalProject, Quote, QuoteFormData } from '../../types/project';
import QuoteForm from '../../components/QuoteForm';
import Chat from '../../components/Chat';

const ProfessionalProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProfessionalProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetchProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      if (!id) throw new Error('ID del proyecto no proporcionado');
      
      const data = await projectService.getProfessionalProject(id);
      setProject(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar el proyecto';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSubmit = async (formData: QuoteFormData) => {
    try {
      if (!id) throw new Error('ID del proyecto no proporcionado');
      
      if (currentQuote) {
        await projectService.updateQuote(currentQuote.quoteId, formData);
        toast.success('Presupuesto actualizado correctamente');
      } else {
        await projectService.createQuote({ ...formData, projectId: id });
        toast.success('Presupuesto enviado correctamente');
      }
      
      fetchProjectDetails();
      setIsModalOpen(false);
      setCurrentQuote(null);
    } catch (error) {
      toast.error('Error al procesar el presupuesto');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('¿Está seguro de eliminar este presupuesto?')) {
      try {
        await projectService.deleteQuote(quoteId);
        toast.success('Presupuesto eliminado correctamente');
        fetchProjectDetails();
      } catch (error) {
        toast.error('Error al eliminar el presupuesto');
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      closed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.closed;
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <ProfessionalSidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return <Navigate to="/professional/projects" />;
  }

  const hasAcceptedQuote = project.quote?.status === 'accepted';
  const isProjectInProgress = project.status === 'in_progress';

  return (
    <div className="flex h-screen">
      <ProfessionalSidebar />
      
      <div className="flex-1 overflow-hidden">
        <Navbar />
        
        <main className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 p-6">
          {/* Encabezado del Proyecto */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status === 'open' && 'Abierto'}
                  {project.status === 'in_progress' && 'En Progreso'}
                  {project.status === 'completed' && 'Completado'}
                  {project.status === 'closed' && 'Cerrado'}
                </span>
              </div>
              {(!project.quote) && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                >
                  Crear Presupuesto
                </button>
              )}
            </div>
          </div>

          {/* Detalles del Proyecto y Presupuestos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <p className="mt-1 text-gray-900">${project.budget || 'No especificado'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                      <p className="mt-1 text-gray-900">{project.clientName || 'Anónimo'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fecha de Inicio</h3>
                      <p className="mt-1 text-gray-900">
                        {project.startDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Presupuesto Actual */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Presupuesto Actual</h2>
                {project.quote ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-sm font-medium text-gray-500 w-1/8 text-left">Monto</th>
                        <th className="text-sm font-medium text-gray-500 w-5/8 text-left">Mensaje</th>
                        <th className="text-sm font-medium text-gray-500 w-1/8 text-left">Estado</th>
                        <th className="text-sm font-medium text-gray-500 w-1/8 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-gray-900 text-left">${project.quote.amount}</td>
                        <td className="text-gray-900 text-left">{project.quote.message || 'No hay mensaje asociado.'}</td>
                        <td className={`text-xs font-medium text-left ${
                          project.quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          project.quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.quote.status === 'pending' ? 'Pendiente' :
                           project.quote.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                        </td>
                        <td className="text-right">
                          {project.quote.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setCurrentQuote(project.quote);
                                  setIsModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(project.quote.quoteId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500">No hay un presupuesto actual.</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
                    >
                      Crear Presupuesto
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Condicional */}
            {isProjectInProgress && hasAcceptedQuote && (
              <div className="lg:col-span-1">
                <Chat projectId={id || ''} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal para Crear/Editar Presupuesto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentQuote(null);
        }}
        title={currentQuote ? 'Editar Presupuesto' : 'Crear Presupuesto'}
      >
        <QuoteForm
          initialData={currentQuote}
          projectId={id || ''}
          onSubmit={handleQuoteSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentQuote(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProfessionalProjectDetailPage; 