import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Default credentials
  const DEFAULT_USERNAME = 'admin';
  const DEFAULT_PASSWORD = 'password123';

  useEffect(() => {
    // Redirect if already authenticated
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/main');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/main');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '100px auto', padding: '20px' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ margin: '0', fontSize: '14px' }}>
          Default credentials:<br />
          Username: {DEFAULT_USERNAME}<br />
          Password: {DEFAULT_PASSWORD}
        </p>
      </div>
      {error && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: 'calc(100% - 16px)', // Subtracting padding from width
              padding: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: 'calc(100% - 16px)', // Subtracting padding from width
              padding: '8px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            width: 'calc(100% - 16px)', // Matching input width
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login; 