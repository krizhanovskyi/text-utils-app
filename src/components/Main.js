import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copyStatus, setCopyStatus] = useState(''); // For copy feedback
  const [delimiter, setDelimiter] = useState(','); // Add state for delimiter
  const [langInputText, setLangInputText] = useState('');
  const [langOutputText, setLangOutputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('latin');
  const [passwordCount, setPasswordCount] = useState(20);
  const [passwordLength, setPasswordLength] = useState(10);
  const [useDigits, setUseDigits] = useState(true);
  const [useSmallLetters, setUseSmallLetters] = useState(true);
  const [useCapitalLetters, setUseCapitalLetters] = useState(true);
  const [useSpecialChars, setUseSpecialChars] = useState(false);
  const [generatedPasswords, setGeneratedPasswords] = useState('');
  const [passwordCopyStatus, setPasswordCopyStatus] = useState('');
  const [prefixText, setPrefixText] = useState('');
  const [insertInputText, setInsertInputText] = useState('');
  const [insertOutputText, setInsertOutputText] = useState('');
  const [insertCopyStatus, setInsertCopyStatus] = useState('');

  // Language character ranges
  const langRanges = {
    latin: /[a-zA-Z]/,  // Only Latin letters
    cyrillic: /[а-яА-ЯёЁїЇіІєЄґҐ]/  // Combined Ukrainian and Russian letters
  };

  const handleProcessText = () => {
    // Split text into lines first
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    
    // Process each line separately
    const processedLines = lines.map((line, index) => {
      // Split by selected delimiter, trim spaces, and wrap each word in single quotes
      const words = delimiter === ','
        ? line.split(',').map(word => `'${word.trim()}'`)
        : line.split(/\s+/).filter(word => word.length > 0).map(word => `'${word}'`);
      
      // Add comma at the end of each line if there's more than one line, but not for the last line
      const lineText = words.join(', ');
      return lines.length > 1 && index < lines.length - 1 ? lineText + ',' : lineText;
    });

    // Join lines with newlines and wrap in brackets
    setOutputText(`(${processedLines.join('\n')})`);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000); // Clear status after 2 seconds
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
  };

  const handleLangCheck = () => {
    const chars = langInputText.split('');
    const results = chars.map(char => {
      if (selectedLang === 'latin') {
        // For Latin, check if it's a letter
        if (/[a-zA-Z]/.test(char)) {
          // Latin letters are matching
          return { char, match: true };
        } else if (/[а-яА-ЯёЁїЇіІєЄґҐ]/.test(char)) {
          // Non-Latin letters (Cyrillic) are non-matching
          return { char, match: false };
        } else {
          // Numbers, punctuation, spaces are treated as matching
          return { char, match: true };
        }
      } else {
        // For Cyrillic, check all letters as before
        if (/[a-zA-Zа-яА-ЯёЁїЇіІєЄґҐ]/.test(char)) {
          const matches = langRanges[selectedLang].test(char);
          return { char, match: matches };
        }
        return { char, match: false };
      }
    });

    // Create spans with different colors based on selected language
    const outputText = results.map(({ char, match }) => {
      if (selectedLang === 'latin') {
        // For Latin, matching (Latin letters and non-letters) are black, non-matching (Cyrillic) are red
        return `<span style="color: ${match ? 'red' : 'black'}">${char}</span>`;
      } else {
        // For Cyrillic, keep original colors
        return `<span style="color: ${match ? 'red' : 'black'}">${char}</span>`;
      }
    }).join('');

    setLangOutputText(outputText);
  };

  const generatePasswords = () => {
    // Validate prefix length
    if (prefixText.length >= passwordLength) {
      setGeneratedPasswords('Error: Prefix length must be shorter than password length');
      return;
    }

    const digits = '0123456789';
    const smallLetters = 'abcdefghijklmnopqrstuvwxyz';
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (useDigits) charset += digits;
    if (useSmallLetters) charset += smallLetters;
    if (useCapitalLetters) charset += capitalLetters;
    if (useSpecialChars) charset += specialChars;

    if (!charset) {
      setGeneratedPasswords('Please select at least one character type');
      return;
    }

    const passwords = [];
    for (let i = 0; i < passwordCount; i++) {
      let password;
      do {
        // Start with prefix
        password = prefixText;
        // Generate remaining characters
        const remainingLength = passwordLength - password.length;
        for (let j = 0; j < remainingLength; j++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
      } while (useDigits && !/\d/.test(password)); // Regenerate if digits required but not present

      passwords.push(password);
    }

    setGeneratedPasswords(passwords.join('\n'));
  };

  const handleCopyPasswords = async () => {
    try {
      await navigator.clipboard.writeText(generatedPasswords);
      setPasswordCopyStatus('Copied!');
      setTimeout(() => setPasswordCopyStatus(''), 2000); // Clear status after 2 seconds
    } catch (err) {
      setPasswordCopyStatus('Failed to copy');
    }
  };

  const handleInsertProcess = () => {
    // Split text into lines and filter out empty lines
    const lines = insertInputText.split('\n').filter(line => line.trim() !== '');
    
    // Process each line
    const processedLines = lines.map(line => {
      // Split line by tabs and filter out empty strings
      const words = line.split('\t').filter(word => word.length > 0);
      // Wrap each word in single quotes and join with commas
      return `(${words.map(word => `'${word.trim()}'`).join(', ')}),`;
    });

    // Join all lines with newlines
    setInsertOutputText(processedLines.join('\n'));
  };

  const handleInsertCopy = async () => {
    try {
      await navigator.clipboard.writeText(insertOutputText);
      setInsertCopyStatus('Copied!');
      setTimeout(() => setInsertCopyStatus(''), 2000);
    } catch (err) {
      setInsertCopyStatus('Failed to copy');
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
              backgroundColor: '#050533',
              borderRadius: '4px',
              cursor: 'pointer'
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
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: 'black',
              borderRadius: '4px'
            }}
            onClick={() => navigate('/matrix')}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#34495e';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'black';
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
        maxWidth: '1240px',  // Match the total width of both frames + gap
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Text Utils</h1>
      </div>

      {/* Main Content Area with both Single Quoter sections */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        margin: '20px auto',
        width: 'fit-content'
      }}>
        {/* Single Quoter (for IN in SQL) Section */}
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
            Single Quoter (for IN in SQL)
          </h3>
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
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter words separated by ${delimiter === ',' ? 'commas' : 'spaces'} (e.g., ${delimiter === ',' ? 'u1, u2' : 'u1 u2'})`}
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
            
            {/* Radio Buttons for Delimiter */}
            <div style={{ 
              marginBottom: '15px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                color: '#495057'
              }}>
                <input
                  type="radio"
                  value=","
                  checked={delimiter === ','}
                  onChange={(e) => setDelimiter(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                Comma separated
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                color: '#495057'
              }}>
                <input
                  type="radio"
                  value="space"
                  checked={delimiter === 'space'}
                  onChange={(e) => setDelimiter(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
                Spaces separated
              </label>
            </div>

            <button
              onClick={handleProcessText}
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
              Process Text
            </button>
          </div>

          {/* Output Text Box with Copy Button */}
          <div style={{ position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Output Text
            </label>
            <div style={{
              width: '100%',  // Full width of container
              padding: '10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              height: '100px',  // Match input height
              marginBottom: '10px',
              boxSizing: 'border-box',  // Include padding in width calculation
              overflowY: 'auto'  // Add scroll if content is too long
            }}>
              {outputText || 'Processed text will appear here'}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <button
                onClick={handleCopyToClipboard}
                disabled={!outputText}
                style={{
                  padding: '8px 15px',
                  backgroundColor: outputText ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: outputText ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = outputText ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = outputText ? '#28a745' : '#6c757d'}
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

        {/* Single Quoter (for INSERT in SQL) Section */}
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
            Single Quoter (for INSERT in SQL)
          </h3>

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
              value={insertInputText}
              onChange={(e) => setInsertInputText(e.target.value)}
              placeholder="Enter words separated by tabs (e.g., value1⇥value2⇥value3)"
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

            <button
              onClick={handleInsertProcess}
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
              Process Text
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Output Text
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
              {insertOutputText || 'Processed text will appear here'}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <button
                onClick={handleInsertCopy}
                disabled={!insertOutputText}
                style={{
                  padding: '8px 15px',
                  backgroundColor: insertOutputText ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: insertOutputText ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = insertOutputText ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = insertOutputText ? '#28a745' : '#6c757d'}
              >
                Copy to Clipboard
              </button>
              {insertCopyStatus && (
                <span style={{ 
                  color: insertCopyStatus === 'Copied!' ? '#28a745' : '#dc3545',
                  fontSize: '14px'
                }}>
                  {insertCopyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Language Check and Password Generator row */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        margin: '20px auto',
        width: 'fit-content'
      }}>
        {/* Language Check Section */}
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
            Language Checker
          </h3>
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
              value={langInputText}
              onChange={(e) => setLangInputText(e.target.value)}
              placeholder="Enter text to check language"
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

            {/* Radio Buttons for Language Selection */}
            <div style={{ 
              marginBottom: '15px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}>
              {['latin', 'cyrillic'].map(lang => (
                <label key={lang} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  color: '#495057'
                }}>
                  <input
                    type="radio"
                    value={lang}
                    checked={selectedLang === lang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </label>
              ))}
            </div>

            <button
              onClick={handleLangCheck}
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
              Check Language
            </button>
          </div>

          {/* Output Text Box */}
          <div style={{ position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#495057',
              fontWeight: '500'
            }}>
              Results
            </label>
            <div 
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                height: '100px',
                marginBottom: '10px',
                boxSizing: 'border-box',
                overflowY: 'auto',
                fontSize: '16px',
                lineHeight: '1.5'
              }}
              dangerouslySetInnerHTML={{ __html: langOutputText || 'Character analysis will appear here' }}
            />
          </div>
        </div>

        {/* Password Generator Section */}
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
            Password Generator
          </h3>

          <div style={{ marginBottom: '20px' }}>
            {/* Number inputs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  color: '#495057',
                  fontWeight: '500'
                }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  title="Maximum value: 100"
                  value={passwordCount}
                  onChange={(e) => setPasswordCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  style={{
                    width: '80px',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  color: '#495057',
                  fontWeight: '500'
                }}>
                  Length
                </label>
                <input
                  type="number"
                  min="4"
                  max="32"
                  title="Maximum value: 32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Math.min(32, Math.max(4, parseInt(e.target.value) || 4)))}
                  style={{
                    width: '80px',
                    padding: '8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
              {[
                { label: 'Digits', state: useDigits, setState: setUseDigits },
                { label: 'Small Letters', state: useSmallLetters, setState: setUseSmallLetters },
                { label: 'Capital Letters', state: useCapitalLetters, setState: setUseCapitalLetters },
                { label: 'Special Characters', state: useSpecialChars, setState: setUseSpecialChars }
              ].map(({ label, state, setState }) => (
                <label key={label} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  color: '#495057'
                }}>
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => setState(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Prefix input with label */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                color: '#495057',
                fontWeight: '500'
              }}>
                Starts with
              </label>
              <div style={{ 
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <input
                  type="text"
                  value={prefixText}
                  onChange={(e) => setPrefixText(e.target.value)}
                  placeholder="Enter prefix"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePasswords}
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
              Generate Passwords
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
              Generated Passwords
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
              whiteSpace: 'pre-line'
            }}>
              {generatedPasswords || 'Generated passwords will appear here'}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <button
                onClick={handleCopyPasswords}
                disabled={!generatedPasswords}
                style={{
                  padding: '8px 15px',
                  backgroundColor: generatedPasswords ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: generatedPasswords ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = generatedPasswords ? '#218838' : '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = generatedPasswords ? '#28a745' : '#6c757d'}
              >
                Copy to Clipboard
              </button>
              {passwordCopyStatus && (
                <span style={{ 
                  color: passwordCopyStatus === 'Copied!' ? '#28a745' : '#dc3545',
                  fontSize: '14px'
                }}>
                  {passwordCopyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main; 