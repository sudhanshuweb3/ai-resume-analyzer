import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
            <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
