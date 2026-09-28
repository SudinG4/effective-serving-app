import { Routes, Route, Navigate } from 'react-router-dom';

import {
  Home,
  Login,
  Signup,
  Dashboard,
  Quiz,
  Results,
  NotFound,
  AboutScreening,
  FAQs,
  PrivacyPolicy,
  Terms
} from './pages';

import About from './screens/about';
import Reports from './screens/reports';
import { ForgotPassword, ResetPassword } from './screens/passwordRecovery';

function isAuthenticated() {
  const user = localStorage.getItem('wbc-user');
  const accessToken = localStorage.getItem('wbc-access-token');

  return !!user && !!accessToken;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public home */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Home />
          </PublicOnlyRoute>
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      {/* Information pages */}
      <Route path="/about" element={<About />} />

      <Route
        path="/about-screening"
        element={<AboutScreening />}
      />

      <Route
        path="/faqs"
        element={<FAQs />}
      />

      <Route
        path="/privacy"
        element={<PrivacyPolicy />}
      />

      <Route
        path="/terms"
        element={<Terms />}
      />

      {/* Logged-in dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Assessment */}
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      {/* Results */}
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="/404"
        element={<NotFound />}
      />

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />

    </Routes>
  );
}
