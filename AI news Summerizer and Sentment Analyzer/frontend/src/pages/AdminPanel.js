
import React, { useEffect, useState } from 'react';

function AdminPanel() {
  const [apiKey, setApiKey] = useState('');
  const [logs, setLogs] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/apikey`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setApiKey(data.newsApi || ''));
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/searchlogs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, []);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/apikey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newsApi: newKey })
      });
      if (res.ok) {
        setApiKey(newKey);
        setNewKey('');
        setError('');
      } else {
        setError('Failed to update API key');
      }
    } catch {
      setError('Failed to update API key');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">NewsAPI Key</h3>
        <div className="mb-2">Current: <span className="font-mono text-xs">{apiKey || 'Not set'}</span></div>
        <form onSubmit={handleSaveKey} className="flex gap-2">
          <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="New API Key" className="border px-2 py-1 rounded" />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
        </form>
        {error && <div className="text-red-500 mt-1">{error}</div>}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Recent User Searches</h3>
        <ul className="max-h-64 overflow-y-auto text-xs">
          {logs.map((log, i) => (
            <li key={i} className="mb-1">{log.keyword} &middot; {log.userIP} &middot; {new Date(log.searchedAt).toLocaleString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
