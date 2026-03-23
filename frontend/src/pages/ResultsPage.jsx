import { useLocation, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { analysisService } from '../services/api';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { CheckCircle, XCircle, ArrowLeft, FileText, Briefcase, Lightbulb } from 'lucide-react';

const scoreColor = (score) =>
  score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

const ScoreGauge = ({ score }) => {
  const color = scoreColor(score);
  const data = [{ value: score }];
  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
      <RadialBarChart
        width={176}
        height={176}
        cx={88}
        cy={88}
        innerRadius={60}
        outerRadius={82}
        startAngle={210}
        endAngle={-30}
        data={data}
        barSize={16}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: '#f3f4f6' }}
          dataKey="value"
          angleAxisId={0}
          cornerRadius={8}
          fill={color}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-extrabold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 font-medium">ATS SCORE</span>
      </div>
    </div>
  );
};

const generateSuggestions = (missingKeywords, score) => {
  const suggestions = [];
  if (missingKeywords?.length > 0) {
    const topMissing = missingKeywords.slice(0, 5).join(', ');
    suggestions.push(`Add the following missing keywords prominently in your resume: ${topMissing}.`);
  }
  if (score < 50) {
    suggestions.push('Your resume has low alignment with this role. Consider tailoring it specifically for this job description.');
  } else if (score < 75) {
    suggestions.push('Good foundation — a few keyword additions could push you above the 75% threshold most ATS systems require.');
  } else {
    suggestions.push('Excellent match! Your resume is well-optimized for this job description.');
  }
  if (missingKeywords?.length > 5) {
    suggestions.push(`There are ${missingKeywords.length - 5} more missing keywords. Review the full list below and incorporate relevant ones.`);
  }
  suggestions.push('Quantify your achievements with specific numbers and metrics wherever possible.');
  return suggestions;
};

const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (!result) {
      analysisService.get(id)
        .then((res) => setResult(res.data?.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) {
    return <div className="text-center py-24 text-gray-400">Loading results…</div>;
  }

  if (!result) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Result not found.</p>
        <Link to="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const suggestions = generateSuggestions(result.missingKeywords, result.atsScore);

  const keywordChartData = [
    { name: 'Matched', value: result.matchedKeywords?.length || 0, fill: '#10b981' },
    { name: 'Missing', value: result.missingKeywords?.length || 0, fill: '#ef4444' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back nav */}
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge score={result.atsScore} />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-sm text-gray-400 mt-0.5">{new Date(result.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Resume:</span>
                <span className="truncate text-gray-600">{result.resumeFileName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Job:</span>
                <span className="truncate text-gray-600">{result.jobDescriptionTitle}</span>
              </div>
            </div>
            {/* Score breakdown mini bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Match: <strong>{result.matchPercentage?.toFixed(1)}%</strong></span>
                <span>ATS Score: <strong style={{ color: scoreColor(result.atsScore) }}>{result.atsScore}/100</strong></span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.atsScore}%`, backgroundColor: scoreColor(result.atsScore) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword chart + breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Keyword Overview</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={keywordChartData} barCategoryGap="40%" barGap={8}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {keywordChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Improvement Suggestions
          </h2>
          <ul className="space-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Matched & Missing keyword lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Matched Keywords
            <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              {result.matchedKeywords?.length || 0}
            </span>
          </h2>
          {result.matchedKeywords?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200">
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No matched keywords found.</p>
          )}
        </div>

        {/* Missing */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            Missing Keywords
            <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              {result.missingKeywords?.length || 0}
            </span>
          </h2>
          {result.missingKeywords?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200">
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">All JD keywords are present in your resume. 🎉</p>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex gap-3 justify-end">
        <Link to="/analyze" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
          Run Another Analysis
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
