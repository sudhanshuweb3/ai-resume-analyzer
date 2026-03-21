import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeService, jobDescriptionService, analysisService } from '../services/api';
import { FileText, Briefcase, Zap, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const AnalyzePage = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJd, setSelectedJd] = useState('');

  // New JD form state
  const [newJdTitle, setNewJdTitle] = useState('');
  const [newJdContent, setNewJdContent] = useState('');
  const [savingJd, setSavingJd] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, jdRes] = await Promise.all([
          resumeService.list(),
          jobDescriptionService.list(),
        ]);
        setResumes(resumeRes.data?.data || []);
        setJobDescriptions(jdRes.data?.data || []);
      } catch (err) {
        setError('Failed to load your data. Please refresh the page.');
      }
    };
    fetchData();
  }, []);

  const handleSaveJd = async (e) => {
    e.preventDefault();
    if (!newJdTitle.trim() || !newJdContent.trim()) return;
    setSavingJd(true);
    try {
      const res = await jobDescriptionService.create({ title: newJdTitle, content: newJdContent });
      const saved = res.data?.data;
      setJobDescriptions((prev) => [saved, ...prev]);
      setSelectedJd(saved.id);
      setNewJdTitle('');
      setNewJdContent('');
    } catch (err) {
      setError('Failed to save job description.');
    } finally {
      setSavingJd(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJd) {
      setError('Please select both a resume and a job description before analyzing.');
      return;
    }
    setError('');
    setAnalyzing(true);
    try {
      const res = await analysisService.analyze(selectedResume, selectedJd);
      const result = res.data?.data;
      navigate(`/results/${result.id}`, { state: { result } });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Analysis failed. Please ensure the AI service is running.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analyze Your Resume</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Select a resume and a job description to get your ATS compatibility score.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Select Resume */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">1</div>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Select Resume
            </h2>
          </div>
          {resumes.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No resumes uploaded yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {resumes.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedResume === r.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <input
                    type="radio"
                    name="resume"
                    value={r.id}
                    checked={selectedResume === r.id}
                    onChange={() => setSelectedResume(r.id)}
                    className="text-blue-600"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.originalFileName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedResume === r.id && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto flex-shrink-0" />}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Select or Create JD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">2</div>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Job Description
            </h2>
          </div>

          {/* Existing JDs */}
          {jobDescriptions.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {jobDescriptions.map((jd) => (
                <label
                  key={jd.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedJd === jd.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <input
                    type="radio"
                    name="jd"
                    value={jd.id}
                    checked={selectedJd === jd.id}
                    onChange={() => setSelectedJd(jd.id)}
                    className="text-blue-600"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate">{jd.title}</p>
                    <p className="text-xs text-gray-400">{new Date(jd.createdAt).toLocaleDateString()}</p>
                  </div>
                  {selectedJd === jd.id && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto flex-shrink-0" />}
                </label>
              ))}
            </div>
          )}

          {/* Add new JD form */}
          <form onSubmit={handleSaveJd} className="space-y-3 border-t pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Or paste a new job description</p>
            <input
              type="text"
              value={newJdTitle}
              onChange={(e) => setNewJdTitle(e.target.value)}
              placeholder="Job title (e.g. Backend Engineer)"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors"
            />
            <textarea
              value={newJdContent}
              onChange={(e) => setNewJdContent(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={4}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={savingJd || !newJdTitle.trim() || !newJdContent.trim()}
              className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingJd ? 'Saving...' : 'Save & Select'}
            </button>
          </form>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !selectedResume || !selectedJd}
          className="flex items-center gap-2 px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {analyzing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</>
          ) : (
            <><Zap className="w-5 h-5" /> Run ATS Analysis</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalyzePage;
