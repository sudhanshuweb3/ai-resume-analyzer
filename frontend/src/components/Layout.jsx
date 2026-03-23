import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, LogOut, LayoutDashboard, User, Zap, Clock, Upload } from 'lucide-react';

const Layout = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label, Icon) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
          ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <FileText className="h-7 w-7 text-blue-600" />
                <span className="font-bold text-lg text-gray-900 tracking-tight hidden sm:block">ResumeAI</span>
              </Link>
              {isAuthenticated && (
                <div className="flex items-center gap-1">
                  {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
                  {navLink('/analyze', 'Analyze', Zap)}
                  {navLink('/history', 'History', Clock)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{user?.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Log in</Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ResumeAI · Built for ATS optimization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
