import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Leaf } from 'lucide-react';

// Importation de nos 3 vraies pages
import Accueil from './pages/Accueil';
import Humeur from './pages/Humeur';
import Exercices from './pages/Exercices';
import Profil from './pages/Profil';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';


const App = () => {
  return (
    <Router>
      <div style={{ 
        fontFamily: 'system-ui, sans-serif', 
        width: '100%',
        maxWidth: '480px',
        minHeight: '100vh',
        margin: '0 auto', 
        backgroundColor: '#ffffff', 
        position: 'relative',
        paddingBottom: '80px',
        boxShadow: '0 0 30px rgba(0,0,0,0.5)',
        boxSizing: 'border-box'
      }}>
        {/* --- LE LOGO EDUCALM (En-tête) --- */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          padding: '20px 0 0 0', gap: '8px' 
        }}>
          <div style={{ backgroundColor: '#14532D', padding: '8px', borderRadius: '12px', display: 'flex' }}>
            <Leaf size={22} color="#FFFFFF" />
          </div>
          <h2 style={{ margin: 0, color: '#14532D', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Edu<span style={{ color: '#D97706' }}>Calm</span>
          </h2>
        </div>
        {/* --------------------------------- */}

        {/* En dessous, tu as normalement tes <Routes> qui ne changent pas */}
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/humeur" element={<Humeur />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>

        <Navbar />

      </div>
    </Router>
  );
};

export default App;