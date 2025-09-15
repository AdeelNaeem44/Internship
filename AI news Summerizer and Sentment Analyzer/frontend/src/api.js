// API utility for frontend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchNews(keyword) {
  const res = await fetch(`${API_BASE}/news?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function fetchSentimentAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/sentiment`);
  if (!res.ok) throw new Error('Failed to fetch sentiment analytics');
  return res.json();
}

export async function fetchWordCloud() {
  const res = await fetch(`${API_BASE}/analytics/wordcloud`);
  if (!res.ok) throw new Error('Failed to fetch word cloud');
  return res.json();
}

export async function fetchTrend() {
  const res = await fetch(`${API_BASE}/analytics/trend`);
  if (!res.ok) throw new Error('Failed to fetch trend data');
  return res.json();
}
