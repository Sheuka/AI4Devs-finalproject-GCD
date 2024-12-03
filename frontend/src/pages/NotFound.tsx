import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div>
      <h2>404 - Página No Encontrada</h2>
      <Link to="/">Regresar al Inicio</Link>
    </div>
  );
};

export default NotFound; 