import React, { useState } from 'react';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin/panel';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-xs">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
