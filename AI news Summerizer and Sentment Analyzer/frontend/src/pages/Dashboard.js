
import React, { useEffect, useState } from 'react';
import { fetchSentimentAnalytics, fetchWordCloud, fetchTrend } from '../api';

function Dashboard() {
  const [sentiment, setSentiment] = useState([]);
  const [wordCloud, setWordCloud] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchSentimentAnalytics(),
      fetchWordCloud(),
      fetchTrend()
    ]).then(([s, w, t]) => {
      setSentiment(s.sentimentDistribution || []);
      setWordCloud(w.wordCloud || []);
      setTrend(t.trend || []);
      setError('');
    }).catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Sentiment Distribution</h3>
          {sentiment.length === 0 ? <div className="text-gray-400">No data</div> : (
            <ul>
              {sentiment.map((s, i) => (
                <li key={i} className="flex items-center mb-1">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${s._id === 'Positive' ? 'bg-green-500' : s._id === 'Negative' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                  {s._id}: {s.count}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Word Cloud */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Word Cloud</h3>
          {wordCloud.length === 0 ? <div className="text-gray-400">No data</div> : (
            <div className="flex flex-wrap gap-2">
              {wordCloud.map(([word, freq], i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800" style={{ fontSize: 12 + freq * 2 }}>{word}</span>
              ))}
            </div>
          )}
        </div>
        {/* Trend Line */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Sentiment Trend (7 days)</h3>
          {trend.length === 0 ? <div className="text-gray-400">No data</div> : (
            <ul>
              {trend.map((t, i) => (
                <li key={i} className="text-xs mb-1">{t._id.day}: {t._id.sentiment} ({t.count})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
