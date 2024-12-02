import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { publicRoutes } from './routes/publicRoutes';
import { clientRoutes } from './routes/clientRoutes';
import { adminRoutes } from './routes/adminRoutes';
import { professionalRoutes } from './routes/professionalRoutes';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {publicRoutes}
        {clientRoutes}
        {adminRoutes}
        {professionalRoutes}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
