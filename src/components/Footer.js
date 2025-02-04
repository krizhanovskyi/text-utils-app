import React from 'react';

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #dee2e6'
    }}>
      <p style={{ margin: 0 }}>
        Copyright © {year} Text Utils. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer; 