import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Demo Entry Routes */}
          {PUBLIC_DEMO_MODE ? (
            <>
              {/* In Public Demo Mode, direct visitors straight to the governance workspace */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              {/* Preserved Direct Auth Routes for Administrator Access / Post-Judging Restoration */}
              <Route path="/portal/login" element={<LoginPage />} />
              <Route path="/portal/register" element={<RegisterPage />} />
              <Route path="/overview" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </>
          )}

          {/* Protected Application Routes */}
          <Route element={<AppLayout requireAuth={!PUBLIC_DEMO_MODE} />}>
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
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
