import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfessionalSidebar from '../../components/ProfessionalSidebar';
import projectService from '../../services/projectService';
import { ProfessionalProject } from '../../types/project';
import { FaSearch, FaFilter, FaClipboardCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProfessionalProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProfessionalProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProfessionalProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProfessionalProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      abierto: 'bg-green-100 text-green-800',
      en_progreso: 'bg-yellow-100 text-yellow-800',
      cerrado: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex h-screen">
      <ProfessionalSidebar />

      <div className="flex-1 overflow-hidden">
        <Navbar />

        <main className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Proyectos Disponibles</h1>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center w-full md:w-1/3">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar por nombre o cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center w-full md:w-1/4">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="todos">Todos los estados</option>
                <option value="abierto">Abierto</option>
                <option value="en_progreso">En Progreso</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          {/* Lista de Proyectos */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center">
                    {project.clientName && <span className="text-sm text-gray-500">Cliente: {project.clientName}</span>}
                    {project.quote && (
                      <FaClipboardCheck className="text-green-500" title="Presupuesto Asignado" />
                    )}
                    <Link
                      to={`/professional/projects/${project.id}`}
                      className="text-primary hover:text-secondary font-medium text-sm"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 ChapuExpress. Todos los derechos reservados.</p>
            <div className="mt-2">
              <Link to="/terms" className="mx-2 hover:underline">Términos y Condiciones</Link>
              |
              <Link to="/support" className="mx-2 hover:underline">Soporte</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalProjectsPage; 