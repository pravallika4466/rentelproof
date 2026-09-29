import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertyFormPage from './pages/PropertyFormPage';
import TenanciesPage from './pages/TenanciesPage';
import TenancyDetailPage from './pages/TenancyDetailPage';
import InspectionsPage from './pages/InspectionsPage';
import InspectionDetailPage from './pages/InspectionDetailPage';
import InspectionWizardPage from './pages/InspectionWizardPage';
import ComparisonPage from './pages/ComparisonPage';
import MaintenancePage from './pages/MaintenancePage';
import MaintenanceDetailPage from './pages/MaintenanceDetailPage';
import PaymentsPage from './pages/PaymentsPage';
import DepositsPage from './pages/DepositsPage';
import DocumentsPage from './pages/DocumentsPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import CinematicLoader from './components/common/CinematicLoader';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <CinematicLoader fullScreen message="Authenticating credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Guard (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CinematicLoader fullScreen message="Initializing session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected App Workspace */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route
            path="/properties/new"
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <PropertyFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />

          <Route path="/tenancies" element={<TenanciesPage />} />
          <Route path="/tenancies/:id" element={<TenancyDetailPage />} />

          <Route path="/inspections" element={<InspectionsPage />} />
          <Route
            path="/inspections/new"
            element={
              <ProtectedRoute allowedRoles={['landlord', 'admin']}>
                <InspectionWizardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/inspections/compare" element={<ComparisonPage />} />
          <Route path="/inspections/:id" element={<InspectionDetailPage />} />

          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetailPage />} />

          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/deposits" element={<DepositsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
