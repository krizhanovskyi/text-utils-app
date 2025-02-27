import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Matrix() {
  const navigate = useNavigate();
  const [matrixInput, setMatrixInput] = useState('');
  const [listOutput, setListOutput] = useState('');
  const [error, setError] = useState('');
  const [includeValues, setIncludeValues] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');

  const handleProcessMatrix = () => {
    setError('');
    try {
      const rows = matrixInput.trim().split('\n').map(row => row.split('\t'));
      const colHeaders = rows[0]; // First row as column headers
      const list = [];

      // Iterate through the matrix starting from the second row
      for (let i = 1; i < rows.length; i++) {
        for (let j = 1; j < rows[i].length; j++) {
          if (rows[i][j]) { // Check if there's a value at the intersection
            const item = {
              Row: colHeaders[j - 1], // Use the column header for the row value
              Column: rows[i][0] // Use the first column as the row identifier
            };
            if (includeValues) {
              item.Value = rows[i][j]; // Include value if checkbox is checked
            }
            list.push(item);
          }
        }
      }

      // Convert list to a string for display
      const output = list.map(item => {
        return includeValues ? `${item.Row}\t${item.Column}\t${item.Value}` : `${item.Row}\t${item.Column}`;
      }).join('\n');
      setListOutput(output);

    } catch (err) {
      setError('Error processing the matrix. Please check the input format.');
    }
  };

  const handleDownload = () => {
    const rows = matrixInput.trim().split('\n').map(row => row.split('\t'));
    const colHeaders = rows[0]; // First row as column headers
    const list = [];

    // Iterate through the matrix starting from the second row
    for (let i = 1; i < rows.length; i++) {
      for (let j = 1; j < rows[i].length; j++) {
        if (rows[i][j]) { // Check if there's a value at the intersection
          const item = {
            Row: colHeaders[j - 1], // Use the column header for the row value
            Column: rows[i][0] // Use the first column as the row identifier
          };
          if (includeValues) {
            item.Value = rows[i][j]; // Include value if checkbox is checked
          }
          list.push(item);
        }
      }
    }

    // Create Excel file
    const ws = XLSX.utils.json_to_sheet(list);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "List");
    XLSX.writeFile(wb, "matrix_to_list.xlsx");
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(listOutput);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000); // Clear status after 2 seconds
    } catch (err) {
      setCopyStatus('Failed to copy');
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
            <div style={{
              padding: '8px 15px',
              backgroundColor: '#050533',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Matrix
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
        <h1 style={{ margin: 0 }}>Matrix to List</h1>
      </div>

      {/* Matrix Section */}
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
          <h3 style={{ 
            margin: '0 0 20px 0',
            padding: '0 0 10px 0',
            borderBottom: '1px solid #ced4da',
            color: '#050533'
          }}>
            Matrix to List
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Input Matrix
            </label>
            <textarea
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              placeholder="Paste your matrix here (tab-separated, as example from Excel)"
              style={{
                width: '100%',
                padding: '10px',
                height: '200px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                marginBottom: '10px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            {error && (
              <div style={{
                color: '#dc3545',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={includeValues}
                  onChange={(e) => setIncludeValues(e.target.checked)}
                />
                Include values
              </label>
            </div>
            <button
              onClick={handleProcessMatrix}
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
              Process Matrix
            </button>
            <button
              onClick={listOutput ? handleDownload : null}
              style={{
                padding: '8px 15px',
                backgroundColor: listOutput ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: listOutput ? 'pointer' : 'not-allowed',
                marginLeft: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = listOutput ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = listOutput ? '#28a745' : '#6c757d'}
            >
              Download
            </button>
          </div>

          {/* Output Section */}
          <div style={{ position: 'relative' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Output List
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
              whiteSpace: 'pre-wrap'
            }}>
              {listOutput || 'Processed list will appear here'}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <button
                onClick={handleCopyToClipboard}
                disabled={!listOutput}
                style={{
                  padding: '8px 15px',
                  backgroundColor: listOutput ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: listOutput ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = listOutput ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = listOutput ? '#28a745' : '#6c757d'}
              >
                Copy to Clipboard
              </button>
              {copyStatus && (
                <span style={{ 
                  color: copyStatus === 'Copied!' ? '#28a745' : '#dc3545',
                  fontSize: '14px'
                }}>
                  {copyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Matrix; 