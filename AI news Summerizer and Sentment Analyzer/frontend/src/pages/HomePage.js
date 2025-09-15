import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/results?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold mb-6">AI News Summarizer & Sentiment Analyzer</h1>
      <form onSubmit={handleSearch} className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter a keyword (e.g., AI, Elections, Startups)"
          className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Get News</button>
      </form>
    </div>
  );
}

export default HomePage;
