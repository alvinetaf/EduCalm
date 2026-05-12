// src/pages/Accueil.jsx — EduCalm (VERSION AVEC RECOMMANDATION)
// Nouveauté : bannière "Dernière recommandation" si l'élève a déjà fait un bilan

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, BrainCircuit, HeartHandshake, ArrowRight, Smile, Headphones, Sparkles } from 'lucide-react';
import monImageAccueil from '../images/app_illustration_home.jpg';
import './Accueil.css';

const Accueil = () => {
  const [pseudo, setPseudo]           = useState('Élève');
  const [dernierBilan, setDernierBilan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const nomSauvegarde = localStorage.getItem('userPseudo');
    if (nomSauvegarde) setPseudo(nomSauvegarde);

    // ✅ Récupère le dernier bilan sauvegardé par Humeur.jsx
    const bilanStr = localStorage.getItem('dernierBilan');
    if (bilanStr) {
      try {
        const bilan = JSON.parse(bilanStr);
        // N'affiche que si le bilan date de moins de 24h
        const age = Date.now() - new Date(bilan.date).getTime();
        if (age < 24 * 60 * 60 * 1000) setDernierBilan(bilan);
      } catch {}
    }
  }, []);

  const hour = new Date().getHours();
  const salutation = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const niveauConfig = {
    1: { bg: '#D1FAE5', border: '#6EE7B7', texte: '#14532D', label: 'Faible',  emoji: '😌' },
    2: { bg: '#FEF3C7', border: '#FCD34D', texte: '#92400E', label: 'Modéré',  emoji: '😐' },
    3: { bg: '#FEE2E2', border: '#FCA5A5', texte: '#991B1B', label: 'Élevé',   emoji: '😰' },
  };

  return (
    <div className="accueil-container">

      {/* ── BANNIÈRE RECOMMANDATION (si bilan récent) ──────────────────── */}
      {dernierBilan && (
        <div style={{
          marginBottom: '28px',
          padding: '16px 24px',
          borderRadius: '16px',
          backgroundColor: niveauConfig[dernierBilan.niveau]?.bg || '#FEF3C7',
          border: `1.5px solid ${niveauConfig[dernierBilan.niveau]?.border || '#FCD34D'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '32px' }}>
            {niveauConfig[dernierBilan.niveau]?.emoji || '🧘'}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '600', color: niveauConfig[dernierBilan.niveau]?.texte, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Ton dernier bilan — Stress {niveauConfig[dernierBilan.niveau]?.label}
            </p>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: niveauConfig[dernierBilan.niveau]?.texte }}>
              Exercice conseillé : {dernierBilan.exercice_titre}
            </p>
          </div>
          <button
            onClick={() => navigate(`/exercices?id=${dernierBilan.exercice_id}`)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: 'none',
              backgroundColor: '#14532D', color: 'white', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Sparkles size={16} /> Lancer
          </button>
        </div>
      )}

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
              <Smile size={18} /> Faire mon bilan du jour
            </button>
            <button className="secondary-btn" onClick={() => navigate('/exercices')}>
              <Headphones size={18} /> Écouter une séance
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
        <div className="quick-card" style={{ borderColor: '#D1FAE5' }} onClick={() => navigate('/exercices')}>
          <div className="card-icon-box" style={{ backgroundColor: '#D1FAE5' }}>
            <BrainCircuit size={26} color="#14532D" />
          </div>
          <div className="card-body">
            <h3 className="card-title">5 min pour me concentrer</h3>
            <p className="card-desc">Une courte séance de pleine conscience pour retrouver le focus avant un cours.</p>
          </div>
          <ArrowRight size={18} color="#14532D" style={{ flexShrink: 0 }} />
        </div>

        <div className="quick-card" style={{ borderColor: '#FEF3C7' }} onClick={() => navigate('/humeur')}>
          <div className="card-icon-box" style={{ backgroundColor: '#FEF3C7' }}>
            <HeartHandshake size={26} color="#D97706" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Respirer avant un devoir</h3>
            <p className="card-desc">Évalue ton humeur et reçois un exercice adapté à ton niveau de stress.</p>
          </div>
          <ArrowRight size={18} color="#D97706" style={{ flexShrink: 0 }} />
        </div>

        <div className="quick-card" style={{ borderColor: '#D1FAE5' }} onClick={() => navigate('/exercices')}>
          <div className="card-icon-box" style={{ backgroundColor: '#D1FAE5' }}>
            <Leaf size={26} color="#14532D" />
          </div>
          <div className="card-body">
            <h3 className="card-title">Pause détente guidée</h3>
            <p className="card-desc">Laisse-toi guider par une voix apaisante pour te relaxer entre deux cours.</p>
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