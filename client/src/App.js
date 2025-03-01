import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; // Landing page
import Twit from './components/Twit'; // Twitter page
import Linke from './components/Linke'; // LinkedIn page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Landing page */}
        <Route path="/twit" element={<Twit />} /> {/* Twitter page */}
        <Route path="/linke" element={<Linke />} /> {/* LinkedIn page */}
      </Routes>
    </Router>
  );
}

export default App;