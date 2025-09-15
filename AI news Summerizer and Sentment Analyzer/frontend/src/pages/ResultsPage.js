
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchNews } from '../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SentimentBadge({ sentiment }) {
  const color = sentiment === 'Positive' ? 'bg-green-500' : sentiment === 'Negative' ? 'bg-red-500' : 'bg-gray-400';
  return <span className={`px-2 py-1 rounded text-white text-xs ml-2 ${color}`}>{sentiment}</span>;
}

function ResultsPage() {
  const query = useQuery();
  const keyword = query.get('keyword') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    fetchNews(keyword)
      .then(data => {
        setArticles(data.articles || []);
        setError('');
      })
      .catch(() => setError('Failed to fetch news.'))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Latest News Results for "{keyword}"</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid gap-6">
        {articles.map((art, i) => (
          <div key={i} className="border rounded p-4 shadow-sm">
            <a href={art.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">{art.headline}</a>
            <div className="text-sm text-gray-500 mb-2">{art.source} &middot; {art.publishedAt ? new Date(art.publishedAt).toLocaleString() : ''}</div>
            <div className="mb-2">{art.summary}</div>
            <SentimentBadge sentiment={art.sentiment} />
            <div className="mt-2 text-xs text-gray-600">Keywords: {art.keywords && art.keywords.join(', ')}</div>
          </div>
        ))}
      </div>
      {!loading && articles.length === 0 && <div className="text-gray-500">No results found.</div>}
    </div>
  );
}

export default ResultsPage;
