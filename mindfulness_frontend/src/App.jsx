import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Accueil from './pages/Accueil';
import Humeur from './pages/Humeur';
import Exercices from './pages/Exercices';
import Profil from './pages/Profil';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';

const AppContent = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/connexion' || location.pathname === '/inscription';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAF8' }}>
      {!hideNav && <Navbar />}
      <main style={{
        flex: 1,
        marginLeft: hideNav ? 0 : '240px',
        minHeight: '100vh',
        backgroundColor: '#F8FAF8',
        overflow: 'auto',
      }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/humeur" element={<Humeur />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
