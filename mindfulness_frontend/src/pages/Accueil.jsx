import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, BrainCircuit, HeartHandshake, ArrowRight, Smile, Headphones } from 'lucide-react';
import monImageAccueil from '../images/app_illustration_home.jpg';
import './Accueil.css'; // Importation du CSS

const Accueil = () => {
  const [pseudo, setPseudo] = useState('Élève');
  const navigate = useNavigate();

  useEffect(() => {
    const nomSauvegarde = localStorage.getItem('userPseudo');
    if (nomSauvegarde) setPseudo(nomSauvegarde);
  }, []);

  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="accueil-container">

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content">
          <p className="salutation-text">{salutation},</p>
          <h1 className="hero-name">
            <span className="pseudo-highlight">{pseudo}</span> 👋
          </h1>
          <p className="hero-subtitle">
            Laisse tes soucis de classe à la porte. Ici, c'est ton refuge pour respirer et te détendre.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/humeur')}>
              <Smile size={18} />
              Faire mon bilan du jour
            </button>
            <button className="secondary-btn" onClick={() => navigate('/exercices')}>
              <Headphones size={18} />
              Écouter une séance
            </button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src={monImageAccueil} alt="Nature apaisante du Cameroun" className="hero-image" />
          <div className="image-overlay"></div>
        </div>
      </div>

      {/* URGENCES CALME */}
      <h2 className="section-title">Tes urgences calme</h2>
      <div className="cards-grid">
        <div
          className="quick-card"
          style={{ borderColor: '#D1FAE5' }}
          onClick={() => navigate('/exercices')}
        >
          <div className="card-icon-box" style={{ backgroundColor: '#D1FAE5' }}>
            <BrainCircuit size={26} color="#14532D" />
          </div>
          <div className="card-body">
            <h3 className="card-title">5 min pour me concentrer</h3>
            <p className="card-desc">
              Une courte séance de pleine conscience pour retrouver le focus avant un cours.
            </p>
          </div>
          <ArrowRight size={18} color="#14532D" style={{ flexShrink: 0 }} />
        </div>

        <div
          className="quick-card"
          style={{ borderColor: '#FEF3C7' }}
          onClick={() => navigate('/humeur')}
        >
          <div className="card-icon-box" style={{ backgroundColor: '#FEF3C7' }}>
            <HeartHandshake size={26} color="#D97706" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Respirer avant un devoir</h3>
            <p className="card-desc">
              Évalue ton humeur et reçois un exercice adapté à ton niveau de stress.
            </p>
          </div>
          <ArrowRight size={18} color="#D97706" style={{ flexShrink: 0 }} />
        </div>

        <div
          className="quick-card"
          style={{ borderColor: '#D1FAE5' }}
          onClick={() => navigate('/exercices')}
        >
          <div className="card-icon-box" style={{ backgroundColor: '#D1FAE5' }}>
            <Leaf size={26} color="#14532D" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Pause détente guidée</h3>
            <p className="card-desc">
              Laisse-toi guider par une voix apaisante pour te relaxer entre deux cours.
            </p>
          </div>
          <ArrowRight size={18} color="#14532D" style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* INTRO */}
      <div className="intro-box">
        <Leaf size={28} color="#D97706" style={{ flexShrink: 0 }} />
        <div>
          <h3 className="intro-title">Bienvenue sur EduCalm</h3>
          <p className="intro-text">
            Ton espace personnel pour gérer le stress scolaire. Fais un bilan émotionnel,
            écoute des exercices de relaxation et suis ton évolution au fil du temps.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Accueil;