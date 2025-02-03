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
    <div style={{ 
      maxWidth: '300px', 
      margin: '150px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      }}>
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
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ced4da',
              borderRadius: '4px'
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
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login; 