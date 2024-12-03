import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirigir al usuario si es necesario
  };

  return (
    <header className="relative w-full bg-white shadow-sm z-50">
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-bold text-primary">
            ChapuExpress
          </Link>
        </div>
        
        <div className="flex items-center justify-end flex-grow">
          <div className="flex items-center space-x-8 mr-8">
            {user?.role === 'CLIENT' && (
              <>
                <Link to="/projects" className="text-primary font-medium">
                  Mis Proyectos
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary">
                  Perfil
                </Link>
                <Link to="/support" className="text-gray-600 hover:text-primary">
                  Soporte
                </Link>
              </>
            )}
          </div>
          
          {user && (
            <div className="flex-shrink-0">
              <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-primary">
                <FaSignOutAlt className="text-xl" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
