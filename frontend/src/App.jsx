import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PUBLIC_DEMO_MODE } from './services/api';
import AppLayout from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContentListPage from './pages/ContentListPage';
import ContentSubmissionPage from './pages/ContentSubmissionPage';
import ContentReviewStudioPage from './pages/ContentReviewStudioPage';
import VersionHistoryPage from './pages/VersionHistoryPage';
import BrandKnowledgePage from './pages/BrandKnowledgePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditLogsPage from './pages/AuditLogsPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public & Demo Entry Routes */}
      <Route
        path="/"
        element={
          PUBLIC_DEMO_MODE ? (
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      {/* Direct Auth & Overview Routes */}
      <Route path="/portal/login" element={<LoginPage />} />
      <Route path="/portal/register" element={<RegisterPage />} />
      <Route path="/overview" element={<LandingPage />} />

      {/* Protected Application Routes */}
      <Route element={<AppLayout requireAuth={true} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/content" element={<ContentListPage />} />
        <Route path="/content/new" element={<ContentSubmissionPage />} />
        <Route path="/content/:id" element={<ContentReviewStudioPage />} />
        <Route path="/content/:id/compare" element={<VersionHistoryPage />} />
        <Route path="/guidelines" element={<BrandKnowledgePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/audit" element={<AuditLogsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
