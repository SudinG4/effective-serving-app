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

function ProtectedRoute({ children }) {
  const user = JSON.parse(
    localStorage.getItem('wbc-user') || 'null'
  );

  const accessToken = localStorage.getItem('wbc-access-token');

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/about-screening"
        element={<AboutScreening />}
      />

      <Route path="/faqs" element={<FAQs />} />

      <Route
        path="/privacy"
        element={<PrivacyPolicy />}
      />

      <Route
        path="/terms"
        element={<Terms />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

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

      <Route
        path="/404"
        element={<NotFound />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/404"
            replace
          />
        }
      />
    </Routes>
  );
}