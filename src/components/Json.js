import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Json() {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleJsonToExcel = () => {
    try {
      // Parse JSON input
      const jsonData = JSON.parse(jsonInput);
      
      // Convert to array if single object
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(dataArray);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      
      // Generate Excel file
      XLSX.writeFile(wb, "converted_data.xlsx");
      
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON format');
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
              backgroundColor: '#050533',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              JSON to Excel
            </div>
            <div style={{
              padding: '8px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: 'black',
              borderRadius: '4px'
            }}
            onClick={() => navigate('/base64')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#34495e';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'black';
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
        <h1 style={{ margin: 0 }}>JSON to Excel</h1>
      </div>

      {/* JSON Section */}
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
              Input JSON
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError('');
              }}
              placeholder="Paste your JSON here"
              style={{
                width: '100%',
                padding: '10px',
                height: '200px',
                borderRadius: '4px',
                border: jsonError ? '1px solid #dc3545' : '1px solid #ced4da',
                marginBottom: '10px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            {jsonError && (
              <div style={{ 
                color: '#dc3545',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {jsonError}
              </div>
            )}

            <button
              onClick={handleJsonToExcel}
              disabled={!jsonInput}
              style={{
                padding: '8px 15px',
                backgroundColor: jsonInput ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: jsonInput ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = jsonInput ? '#0056b3' : '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = jsonInput ? '#007bff' : '#6c757d'}
            >
              Convert to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Json; 