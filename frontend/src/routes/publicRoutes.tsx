import React from 'react';
import { Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RecoverPasswordPage from '../pages/RecoverPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import NotFound from '../pages/NotFound';
import PublicRoute from '../components/PublicRoute';

export const publicRoutes = [
  <Route 
    path="/" 
    element={
      <PublicRoute>
        <HomePage />
      </PublicRoute>
    } 
    key="home"
  />,
  <Route path="/login" element={<LoginPage />} key="login" />,
  <Route path="/register" element={<RegisterPage />} key="register" />,
  <Route path="/recover-password" element={<RecoverPasswordPage />} key="recover-password" />,
  <Route path="/reset-password" element={<ResetPasswordPage />} key="reset-password" />,
  <Route path="*" element={<NotFound />} key="not-found" />
]; 