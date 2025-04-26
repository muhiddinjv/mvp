import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboardin';
import HowTo from './pages/HowTo';
import AnkiPage from './pages/AnkiPage';
import Chapters from './pages/Chapters';
import NoPage from "./pages/NoPage";
import Stories from "./pages/Stories";

const App = () => {
  const onboarded = localStorage.getItem('onboarded') === 'true';

  return (
    <Router>
      <Routes>
        {!onboarded ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Chapters />} />
            <Route path="/howto" element={<HowTo />} />
            <Route path="/anki/:chapterId" element={<AnkiPage />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="*" element={<NoPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
