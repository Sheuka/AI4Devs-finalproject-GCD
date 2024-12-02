import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaProjectDiagram, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gray-800 text-gray-100 min-h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        <span>Admin</span>
      </div>
      <nav className="mt-6">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`
          }
        >
          <FaTachometerAlt className="mr-3 text-lg" />
          Dashboard
        </NavLink>
        <NavLink 
          to="/admin/professionals" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`
          }
        >
          <FaUsers className="mr-3 text-lg" />
          Gestión de Profesionales
        </NavLink>
        <NavLink 
          to="/admin/projects" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`
          }
        >
          <FaProjectDiagram className="mr-3 text-lg" />
          Gestión de Proyectos
        </NavLink>
        <NavLink 
          to="/admin/reports" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
            }`
          }
        >
          <FaChartBar className="mr-3 text-lg" />
          Reportes
        </NavLink>
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `flex items-center py-3 px-6 hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
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

export default Sidebar; 