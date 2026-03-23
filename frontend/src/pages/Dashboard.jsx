import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisService, resumeService } from '../services/api';
import { FileText, Zap, BarChart2, Clock, TrendingUp, ArrowRight } from 'lucide-react';

const ScoreBadge = ({ score }) => {
  const color = score >= 75 ? 'text-green-600 bg-green-50 border-green-200'
    : score >= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
    : 'text-red-600 bg-red-50 border-red-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {score}%
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysisRes, resumeRes] = await Promise.all([
          analysisService.list(),
          resumeService.list(),
        ]);
        setHistory(analysisRes.data?.data || []);
        setResumeCount((resumeRes.data?.data || []).length);
      } catch (_) {
        // fail silently — user may not have data yet
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgScore = history.length
    ? Math.round(history.reduce((sum, r) => sum + r.atsScore, 0) / history.length)
    : 0;

  const bestScore = history.length
    ? Math.max(...history.map((r) => r.atsScore))
    : 0;

  const recentHistory = history.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{user?.email?.split('@')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's an overview of your resume analysis activity.</p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Zap className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Resumes Uploaded" value={resumeCount} color="bg-blue-50 text-blue-600" />
        <StatCard icon={Zap} label="Analyses Run" value={history.length} color="bg-purple-50 text-purple-600" />
        <StatCard icon={TrendingUp} label="Average ATS Score" value={`${avgScore}%`} color="bg-green-50 text-green-600" />
        <StatCard icon={BarChart2} label="Best Score" value={`${bestScore}%`} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Recent History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Recent Analyses
          </h2>
          {history.length > 5 && (
            <Link to="/history" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : recentHistory.length === 0 ? (
          <div className="py-12 text-center">
            <Zap className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No analyses yet.</p>
            <Link to="/analyze" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
              Start your first analysis →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentHistory.map((item) => (
              <Link
                key={item.id}
                to={`/results/${item.id}`}
                state={{ result: item }}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.resumeFileName}</p>
                    <p className="text-xs text-gray-400 truncate">vs. {item.jobDescriptionTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <ScoreBadge score={item.atsScore} />
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
