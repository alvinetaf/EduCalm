// src/pages/Humeur.jsx — EduCalm (VERSION AMÉLIORÉE)
// Nouveautés :
//   - Affichage du score ET du niveau (Faible / Modéré / Élevé) avec couleur
//   - Sauvegarde du dernier résultat dans localStorage pour l'Accueil
//   - Navigation directe vers l'exercice recommandé (avec scroll vers la carte)
//   - URL relative (proxy Vite) au lieu de http://localhost

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import questionsPsy from '../questions.json';

// ─── Config visuelle par niveau ───────────────────────────────────────────────
const NIVEAU_CONFIG = {
  1: {
    libelle: 'Faible',
    emoji: '😌',
    couleurBg: '#D1FAE5',
    couleurTexte: '#14532D',
    couleurBord: '#6EE7B7',
    message: 'Ton esprit est serein. Continue comme ça !',
  },
  2: {
    libelle: 'Modéré',
    emoji: '😐',
    couleurBg: '#FEF3C7',
    couleurTexte: '#92400E',
    couleurBord: '#FCD34D',
    message: 'Un peu de tension détectée. Un exercice te fera du bien.',
  },
  3: {
    libelle: 'Élevé',
    emoji: '😰',
    couleurBg: '#FEE2E2',
    couleurTexte: '#991B1B',
    couleurBord: '#FCA5A5',
    message: 'Tu ressens beaucoup de pression. Prends soin de toi maintenant.',
  },
};

const Humeur = () => {
  const navigate = useNavigate();

  const [indexQuestion, setIndexQuestion]   = useState(0);
  const [reponses, setReponses]             = useState([]);
  const [resultatApi, setResultatApi]       = useState(null);
  const [enChargement, setEnChargement]     = useState(false);
  const [erreur, setErreur]                 = useState('');

  // ── Navigation vers l'exercice recommandé ────────────────────────────────
  const lancerExercice = (idExo) => {
    navigate(`/exercices?id=${idExo}`);
  };

  // ── Sélection d'une réponse ───────────────────────────────────────────────
  const handleSelection = async (points) => {
    const nouvellesReponses = [...reponses, points];

    if (indexQuestion < questionsPsy.length - 1) {
      setReponses(nouvellesReponses);
      setIndexQuestion(indexQuestion + 1);
      return;
    }

    // Dernière question → envoi à l'API
    setEnChargement(true);
    try {
      const monIdEleve = localStorage.getItem('userId');

      // ✅ URL relative via proxy Vite (plus de http://localhost)
      const response = await axios.post(
        '/mindfulness_backend/evaluate_stress.php',
        { reponses: nouvellesReponses, user_id: monIdEleve }
      );

      if (response.data.success) {
        const resultat = response.data;
        setResultatApi(resultat);

        // ✅ Sauvegarde dans localStorage pour que l'Accueil puisse afficher
        // une bannière de recommandation sans refaire le test
        localStorage.setItem('dernierBilan', JSON.stringify({
          score:          resultat.score,
          niveau:         resultat.niveau,
          niveau_libelle: resultat.niveau_libelle,
          exercice_id:    resultat.recommandation.exercice?.id,
          exercice_titre: resultat.recommandation.exercice?.title,
          date:           new Date().toISOString(),
        }));
      } else {
        setErreur(response.data.message);
      }
    } catch {
      setErreur("Connexion impossible. Vérifie que XAMPP est lancé, ou fais un exercice depuis l'accueil.");
    } finally {
      setEnChargement(false);
    }
  };

  const recommencer = () => {
    setResultatApi(null);
    setIndexQuestion(0);
    setReponses([]);
    setErreur('');
  };

  const progress = ((indexQuestion + 1) / questionsPsy.length) * 100;

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Bilan Émotionnel</h1>
        <p style={styles.subtitle}>Réponds honnêtement tes réponses restent privées.</p>
      </div>

      <div style={styles.contentArea}>

        {/* Chargement */}
        {enChargement && (
          <div style={styles.loadingBox}>
            <p style={styles.texteAttente}>Analyse en cours par EduCalm...</p>
          </div>
        )}

        {/* Erreur */}
        {erreur && !enChargement && (
          <div style={styles.erreurBox}>
            <p style={{ margin: '0 0 12px 0' }}>{erreur}</p>
            <button onClick={recommencer} style={styles.resetButton}>
              Réessayer
            </button>
          </div>
        )}

        {/* ── VUE 1 : QUESTIONNAIRE ─────────────────────────────────────── */}
        {!resultatApi && !enChargement && !erreur && (
          <div style={styles.questionnaireWrapper}>

            {/* Barre de progression */}
            <div style={styles.progressContainer}>
              <div style={styles.progressLabels}>
                <span style={styles.progressText}>
                  Question {indexQuestion + 1} / {questionsPsy.length}
                </span>
                <span style={styles.progressText}>{Math.round(progress)}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
            </div>

            {/* Carte question */}
            <div style={styles.card} key={indexQuestion}>
              <p style={styles.questionText}>{questionsPsy[indexQuestion].texte}</p>
              <div style={styles.optionsContainer}>
                {questionsPsy[indexQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelection(option.points)}
                    style={styles.optionButton}
                    onMouseEnter={e => {
                      e.target.style.backgroundColor = '#D1FAE5';
                      e.target.style.borderColor = '#14532D';
                    }}
                    onMouseLeave={e => {
                      e.target.style.backgroundColor = '#F0FDF4';
                      e.target.style.borderColor = '#D1FAE5';
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── VUE 2 : RÉSULTAT ──────────────────────────────────────────── */}
        {resultatApi && (
          <div style={styles.resultWrapper}>
            <div style={styles.resultCard}>

              {/* En-tête avec niveau de stress */}
              {(() => {
                const cfg = NIVEAU_CONFIG[resultatApi.niveau] || NIVEAU_CONFIG[1];
                return (
                  <div style={{
                    ...styles.niveauBanner,
                    backgroundColor: cfg.couleurBg,
                    borderColor: cfg.couleurBord,
                  }}>
                    <span style={styles.niveauEmoji}>{cfg.emoji}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: cfg.couleurTexte, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Niveau de stress
                      </p>
                      <p style={{ margin: 0, fontSize: '22px', color: cfg.couleurTexte, fontWeight: '800' }}>
                        {cfg.libelle}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: cfg.couleurTexte }}>
                        {cfg.message}
                      </p>
                    </div>
                    <div style={styles.scoreBadge}>
                      <p style={{ margin: 0, fontSize: '11px', color: cfg.couleurTexte, fontWeight: '600' }}>Score</p>
                      <p style={{ margin: 0, fontSize: '28px', color: cfg.couleurTexte, fontWeight: '800', lineHeight: 1 }}>
                        {resultatApi.score}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: cfg.couleurTexte }}>/ 12</p>
                    </div>
                  </div>
                );
              })()}

              {/* Conseil */}
              <div style={styles.tipBox}>
                <strong>💡 Conseil EduCalm :</strong>
                <br />
                <span style={{ lineHeight: '1.7' }}>{resultatApi.recommandation.conseil}</span>
              </div>

              {/* Exercice recommandé */}
              {resultatApi.recommandation.exercice && (
                <div style={styles.exoBox}>
                  <p style={styles.exoLabel}>Exercice recommandé pour toi :</p>
                  <h3 style={styles.exoTitle}>{resultatApi.recommandation.exercice.title}</h3>
                  <p style={styles.exoDesc}>{resultatApi.recommandation.exercice.description}</p>
                  <p style={styles.exoDuration}>⏱ {resultatApi.recommandation.exercice.duration}</p>

                  <div style={styles.resultButtons}>
                    <button
                      style={styles.playButton}
                      onClick={() => lancerExercice(resultatApi.recommandation.exercice.id)}
                    >
                      ▶ Lancer l'exercice
                    </button>
                    <button style={styles.resetButton} onClick={recommencer}>
                      Refaire le test
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    padding: '40px 48px',
    minHeight: '100vh',
    backgroundColor: '#FAFAF9',
    animation: 'fadeIn 0.4s ease',
  },
  pageHeader: { marginBottom: '36px' },
  title: { fontSize: '32px', color: '#422006', margin: '0 0 8px 0', fontWeight: '800' },
  subtitle: { fontSize: '15px', color: '#78350F', margin: 0, fontWeight: '500' },
  contentArea: { maxWidth: '680px' },
  loadingBox: {
    padding: '24px', backgroundColor: '#FEF3C7',
    borderRadius: '16px', textAlign: 'center', border: '1px solid #FDE68A',
  },
  texteAttente: { color: '#D97706', fontWeight: '700', margin: 0, fontSize: '16px' },
  erreurBox: {
    padding: '20px', backgroundColor: '#FEE2E2', color: '#991B1B',
    border: '1px solid #FCA5A5', borderRadius: '16px', fontSize: '14px', lineHeight: '1.6',
  },
  questionnaireWrapper: { display: 'flex', flexDirection: 'column', gap: '24px' },
  progressContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
  progressLabels: { display: 'flex', justifyContent: 'space-between' },
  progressText: {
    fontSize: '13px', color: '#94A3B8', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  progressBar: {
    width: '100%', height: '8px', backgroundColor: '#E2E8F0',
    borderRadius: '4px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#14532D',
    borderRadius: '4px', transition: 'width 0.4s ease',
  },
  card: {
    backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
    animation: 'slideUp 0.3s ease',
  },
  questionText: {
    fontSize: '20px', color: '#422006', fontWeight: '600',
    lineHeight: '1.5', margin: '0 0 28px 0',
  },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionButton: {
    padding: '16px 20px', borderRadius: '12px', border: '2px solid #D1FAE5',
    backgroundColor: '#F0FDF4', color: '#14532D', fontSize: '15px',
    fontWeight: '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
  },

  // Résultat
  resultWrapper: { animation: 'fadeIn 0.5s ease' },
  resultCard: {
    backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
    display: 'flex', flexDirection: 'column', gap: '24px',
  },

  // Bannière niveau
  niveauBanner: {
    display: 'flex', alignItems: 'center', gap: '20px',
    padding: '20px 24px', borderRadius: '16px',
    border: '2px solid', flexWrap: 'wrap',
  },
  niveauEmoji: { fontSize: '48px', lineHeight: 1, flexShrink: 0 },
  scoreBadge: {
    marginLeft: 'auto', textAlign: 'center',
    background: 'rgba(255,255,255,0.5)', borderRadius: '12px',
    padding: '12px 16px', flexShrink: 0,
  },

  // Conseil
  tipBox: {
    backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '14px',
    borderLeft: '4px solid #D97706', color: '#78350F', lineHeight: '1.6', fontSize: '15px',
  },

  // Exercice
  exoBox: {
    backgroundColor: '#F8FAF8', padding: '24px',
    borderRadius: '16px', border: '1px solid #E4E4E7',
  },
  exoLabel: {
    margin: '0 0 8px 0', fontSize: '13px', color: '#71717A',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  exoTitle: { margin: '0 0 8px 0', color: '#422006', fontSize: '20px', fontWeight: '700' },
  exoDesc:  { margin: '0 0 8px 0', color: '#52525B', fontSize: '14px', lineHeight: '1.6' },
  exoDuration: { fontSize: '13px', color: '#D97706', fontWeight: '600', margin: '0 0 20px 0' },

  resultButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  playButton: {
    flex: 1, padding: '14px', borderRadius: '12px',
    backgroundColor: '#14532D', color: '#FFFFFF', border: 'none',
    fontWeight: '700', fontSize: '15px', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.25)', minWidth: '160px',
  },
  resetButton: {
    flex: 1, padding: '14px', borderRadius: '12px',
    backgroundColor: '#F3F4F6', color: '#4B5563', border: 'none',
    fontWeight: '600', fontSize: '15px', cursor: 'pointer', minWidth: '120px',
  },
};

export default Humeur;