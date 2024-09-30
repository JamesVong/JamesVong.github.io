import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SMPLPage from './pages/SMPLPage';

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/smpl" element={<SMPLPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;