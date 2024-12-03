import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaProjectDiagram, FaClipboardList, FaCog } from 'react-icons/fa';

const ProfessionalSidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gradient-to-br from-blue-50 to-orange-50 text-gray-800 min-h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-300">
        <span>Profesional</span>
      </div>
      <nav className="mt-6">
        <NavLink 
          to="/professional/dashboard" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-200 transition-colors ${
              isActive ? 'bg-gray-200 text-primary' : 'text-gray-700'
            }`
          }
        >
          <FaTachometerAlt className="mr-3 text-lg" />
          Dashboard
        </NavLink>
        <NavLink 
          to="/professional/projects" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-200 transition-colors ${
              isActive ? 'bg-gray-200 text-primary' : 'text-gray-700'
            }`
          }
        >
          <FaProjectDiagram className="mr-3 text-lg" />
          Proyectos
        </NavLink>
        <NavLink 
          to="/professional/quotes" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-200 transition-colors ${
              isActive ? 'bg-gray-200 text-primary' : 'text-gray-700'
            }`
          }
        >
          <FaClipboardList className="mr-3 text-lg" />
          Presupuestos Enviados
        </NavLink>
        <NavLink 
          to="/professional/settings" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-200 transition-colors ${
              isActive ? 'bg-gray-200 text-primary' : 'text-gray-700'
            }`
          }
        >
          <FaCog className="mr-3 text-lg" />
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
};

export default ProfessionalSidebar; 