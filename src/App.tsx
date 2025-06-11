import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersPage } from '@/pages/UsersPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { FileManagerPage } from '@/pages/FileManagerPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Public Routes - accessible even when authenticated for UI testing */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="files" element={<FileManagerPage />} />
            </Route>

            {/* Redirect root to login for UI testing */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all route - redirect to login for UI testing */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;