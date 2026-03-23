import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisService } from '../services/api';
import { FileText, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';

const scoreColor = (score) =>
  score >= 75 ? 'text-green-600 bg-green-50 border-green-200'
  : score >= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
  : 'text-red-600 bg-red-50 border-red-200';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    analysisService.list()
      .then((res) => setHistory(res.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...history].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === 'createdAt') { aVal = new Date(aVal); bVal = new Date(bVal); }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className={`w-3 h-3 ${sortKey === col && sortDir === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
      <ChevronDown className={`w-3 h-3 -mt-1 ${sortKey === col && sortDir === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
    </span>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        <p className="text-sm text-gray-500 mt-1">All your previous ATS analyses, sorted and filterable.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Resume</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Job Title</th>
                <th
                  className="px-6 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => toggleSort('atsScore')}
                >
                  <span className="flex items-center">ATS Score <SortIcon col="atsScore" /></span>
                </th>
                <th
                  className="px-6 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => toggleSort('createdAt')}
                >
                  <span className="flex items-center">Date <SortIcon col="createdAt" /></span>
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-500">No analyses yet.</p>
                    <Link to="/analyze" className="text-blue-600 text-sm hover:underline">Run your first analysis →</Link>
                  </td>
                </tr>
              ) : sorted.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-gray-800 font-medium">{item.resumeFileName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{item.jobDescriptionTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreColor(item.atsScore)}`}>
                      {item.atsScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/results/${item.id}`}
                      state={{ result: item }}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
