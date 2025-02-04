import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Base64 from './components/Base64';
import Json from './components/Json';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/base64" element={<Base64 />} />
        <Route path="/json" element={<Json />} />
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
