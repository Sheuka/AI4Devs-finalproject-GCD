import React from 'react';
import { Route } from 'react-router-dom';
import ProfessionalProjectsPage from '../pages/professional/ProfessionalProjectsPage';
import ProfilePage from '../pages/ProfilePage';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfessionalProjectDetailPage from '../pages/professional/ProfessionalProjectDetailPage';

export const professionalRoutes = [
  <Route 
    path="/professional/projects" 
    element={
      <ProtectedRoute requiredRole="PROFESSIONAL">
        <ProfessionalProjectsPage />
      </ProtectedRoute>
    } 
    key="professional-projects"
  />,
  <Route 
    path="/professional/projects/:id" 
    element={
      <ProtectedRoute requiredRole="PROFESSIONAL">
        <ProfessionalProjectDetailPage />
      </ProtectedRoute>
    } 
    key="professional-project-detail"
  />,
  <Route 
    path="/professional/profile" 
    element={
      <ProtectedRoute requiredRole="PROFESSIONAL">
        <ProfilePage />
      </ProtectedRoute>
    } 
    key="professional-profile"
  />,
  <Route 
    path="/professional/chat/:projectId" 
    element={
      <ProtectedRoute requiredRole="PROFESSIONAL">
        <ChatPage />
      </ProtectedRoute>
    } 
    key="professional-chat"
  />
]; 