import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Base64() {
  const navigate = useNavigate();
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  const [base64CopyStatus, setBase64CopyStatus] = useState('');

  const handleBase64Process = () => {
    try {
      if (base64Mode === 'encode') {
        const encoded = btoa(base64Input);
        setBase64Output(encoded);
      } else {
        const decoded = atob(base64Input);
        setBase64Output(decoded);
      }
    } catch (error) {
      setBase64Output('Error: Invalid input for ' + base64Mode);
    }
  };

  const handleCopyBase64 = async () => {
    try {
      await navigator.clipboard.writeText(base64Output);
      setBase64CopyStatus('Copied!');
      setTimeout(() => setBase64CopyStatus(''), 2000);
    } catch (err) {
      setBase64CopyStatus('Failed to copy');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Panel */}
      <div style={{
        backgroundColor: '#F0F0F0',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left side - Brand and Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: '30px',
                width: 'auto'
              }}
            />
            <h2 style={{ margin: 0, color: 'black'}}> </h2>
          </div>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{
              padding: '8px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: 'black',
              borderRadius: '4px'
            }}
            onClick={() => navigate('/main')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#34495e';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'black';
            }}>
              Text Utils
            </div>
            <div style={{
              padding: '8px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: 'black',
              borderRadius: '4px'
            }}
            onClick={() => navigate('/json')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#34495e';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'black';
            }}>
              JSON to Excel
            </div>
            <div style={{
              padding: '8px 15px',
              backgroundColor: '#050533',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Base64
            </div>
          </div>
        </div>

        {/* Right side - Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        </div>
      </div>

      {/* Title */}
      <div style={{
        textAlign: 'center',
        margin: '20px 0',
        color: '#050533',
        borderBottom: '2px solid #050533',
        maxWidth: '1240px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Base64 Encode/Decode</h1>
      </div>

      {/* Base64 Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        margin: '20px auto',
        width: 'fit-content'
      }}>
        <div style={{ 
          padding: '20px', 
          width: '600px',
          border: '1px solid #ced4da',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Input Text
            </label>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Enter text to encode or decode"
              style={{
                width: '100%',
                padding: '10px',
                height: '100px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                marginBottom: '10px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Radio Buttons for Mode Selection */}
            <div style={{ 
              marginBottom: '15px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}>
              {['encode', 'decode'].map(mode => (
                <label key={mode} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  color: '#495057'
                }}>
                  <input
                    type="radio"
                    value={mode}
                    checked={base64Mode === mode}
                    onChange={(e) => setBase64Mode(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </label>
              ))}
            </div>

            <button
              onClick={handleBase64Process}
              style={{
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              {base64Mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
          </div>

          {/* Output */}
          <div style={{ position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Output
            </label>
            <div style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              height: '100px',
              marginBottom: '10px',
              boxSizing: 'border-box',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {base64Output || 'Processed text will appear here'}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <button
                onClick={handleCopyBase64}
                disabled={!base64Output}
                style={{
                  padding: '8px 15px',
                  backgroundColor: base64Output ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: base64Output ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = base64Output ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = base64Output ? '#28a745' : '#6c757d'}
              >
                Copy to Clipboard
              </button>
              {base64CopyStatus && (
                <span style={{ 
                  color: base64CopyStatus === 'Copied!' ? '#28a745' : '#dc3545',
                  fontSize: '14px'
                }}>
                  {base64CopyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base64; 