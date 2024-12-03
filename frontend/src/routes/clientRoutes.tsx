import React from 'react';
import { Route } from 'react-router-dom';
import ProjectsPage from '../pages/ProjectsPage';
import CreateProjectPage from '../pages/CreateProjectPage';
import ProjectPage from '../pages/ProjectPage';
import ProfilePage from '../pages/ProfilePage';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from '../components/ProtectedRoute';

export const clientRoutes = [
  <Route 
    path="/projects" 
    element={
      <ProtectedRoute requiredRole="CLIENT">
        <ProjectsPage />
      </ProtectedRoute>
    } 
    key="projects"
  />,
  <Route 
    path="/projects/new" 
    element={
      <ProtectedRoute requiredRole="CLIENT">
        <CreateProjectPage />
      </ProtectedRoute>
    } 
    key="create-project"
  />,
  <Route 
    path="/projects/:id" 
    element={
      <ProtectedRoute requiredRole="CLIENT">
        <ProjectPage />
      </ProtectedRoute>
    } 
    key="project-detail"
  />,
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute requiredRole="CLIENT">
        <ProfilePage />
      </ProtectedRoute>
    } 
    key="profile"
  />,
  <Route 
    path="/chat/:projectId" 
    element={
      <ProtectedRoute requiredRole="CLIENT">
        <ChatPage />
      </ProtectedRoute>
    } 
    key="chat"
  />
]; 