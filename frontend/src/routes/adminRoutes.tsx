import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProfessionalsPage from '../pages/admin/ProfessionalsPage';
import ProtectedRoute from '../components/ProtectedRoute';

export const adminRoutes = [
  <Route 
    path="/admin/dashboard" 
    element={
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    } 
    key="admin-dashboard"
  />,
  <Route 
    path="/admin/professionals" 
    element={
      <ProtectedRoute requiredRole="ADMIN">
        <ProfessionalsPage />
      </ProtectedRoute>
    } 
    key="admin-professionals"
  />
]; 