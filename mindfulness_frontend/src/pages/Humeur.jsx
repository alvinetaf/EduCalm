import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import questionsPsy from '../questions.json';

const Humeur = () => {
  const navigate = useNavigate();

  const [indexQuestion, setIndexQuestion] = useState(0);
  const [reponses, setReponses] = useState([]);
  const [resultatApi, setResultatApi] = useState(null);
  const [enChargement, setEnChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const lancerExercice = (idExo) => {
    navigate(`/exercices?id=${idExo}`);
  };

  const handleSelection = async (points) => {
    const nouvellesReponses = [...reponses, points];

    if (indexQuestion < questionsPsy.length - 1) {
      setReponses(nouvellesReponses);
      setIndexQuestion(indexQuestion + 1);
    } else {
      setEnChargement(true);
      try {
        const monIdEleve = localStorage.getItem('userId');
        console.log("ID envoyé à PHP :", monIdEleve);

        const response = await axios.post('http://localhost/mindfulness_backend/evaluate_stress.php', {
          reponses: nouvellesReponses,
          user_id: monIdEleve,
        });

        if (response.data.success) {
          setResultatApi(response.data.recommandation);
        } else {
          setErreur(response.data.message);
        }
      } catch (error) {
        setErreur("Connexion au serveur impossible. Lance un exercice de respiration depuis l'accueil.");
      } finally {
        setEnChargement(false);
      }
    }
  };

  const progress = ((indexQuestion + 1) / questionsPsy.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Bilan Émotionnel</h1>
        <p style={styles.subtitle}>Réponds honnêtement — tes réponses restent privées.</p>
      </div>

      <div style={styles.contentArea}>

        {enChargement && (
          <div style={styles.loadingBox}>
            <p style={styles.texteAttente}>Analyse en cours par EduCalm...</p>
          </div>
        )}

        {erreur && (
          <div style={styles.erreurBox}>
            {erreur}
          </div>
        )}

        {/* VUE 1 : QUESTIONNAIRE */}
        {!resultatApi && !enChargement && !erreur && (
          <div style={styles.questionnaireWrapper}>
            {/* Barre de progression */}
            <div style={styles.progressContainer}>
              <div style={styles.progressLabels}>
                <span style={styles.progressText}>Question {indexQuestion + 1} / {questionsPsy.length}</span>
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
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VUE 2 : RÉSULTAT */}
        {resultatApi && (
          <div style={styles.resultWrapper}>
            <div style={styles.resultCard}>
              <h2 style={styles.resultTitle}>Diagnostic terminé ✅</h2>

              <div style={styles.tipBox}>
                <strong>Conseil EduCalm :</strong>
                <br />
                {resultatApi.conseil}
              </div>

              <div style={styles.exoBox}>
                <p style={styles.exoLabel}>Exercice recommandé pour toi :</p>
                <h3 style={styles.exoTitle}>{resultatApi.exercice.title}</h3>
                <p style={styles.exoDuration}>Durée : {resultatApi.exercice.duration} min</p>

                <div style={styles.resultButtons}>
                  <button
                    style={styles.playButton}
                    onClick={() => lancerExercice(resultatApi.exercice.id)}
                  >
                    Lancer l'exercice
                  </button>
                  <button
                    style={styles.resetButton}
                    onClick={() => { setResultatApi(null); setIndexQuestion(0); setReponses([]); }}
                  >
                    Recommencer le test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 48px',
    minHeight: '100vh',
    backgroundColor: '#FAFAF9',
    animation: 'fadeIn 0.4s ease',
  },
  pageHeader: {
    marginBottom: '36px',
  },
  title: {
    fontSize: '32px',
    color: '#422006',
    margin: '0 0 8px 0',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '15px',
    color: '#78350F',
    margin: 0,
    fontWeight: '500',
  },
  contentArea: {
    maxWidth: '680px',
  },
  loadingBox: {
    padding: '24px',
    backgroundColor: '#FEF3C7',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #FDE68A',
  },
  texteAttente: {
    color: '#D97706',
    fontWeight: '700',
    margin: 0,
    fontSize: '16px',
  },
  erreurBox: {
    padding: '20px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: '1px solid #FCA5A5',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  questionnaireWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: '13px',
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E2E8F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14532D',
    borderRadius: '4px',
    transition: 'width 0.4s ease',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '32px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6',
    animation: 'slideUp 0.3s ease',
  },
  questionText: {
    fontSize: '20px',
    color: '#422006',
    marginBottom: '28px',
    fontWeight: '600',
    lineHeight: '1.5',
    margin: '0 0 28px 0',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionButton: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid #D1FAE5',
    backgroundColor: '#F0FDF4',
    color: '#14532D',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  resultWrapper: {
    animation: 'fadeIn 0.5s ease',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: '36px',
    borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6',
  },
  resultTitle: {
    color: '#14532D',
    margin: '0 0 24px 0',
    fontSize: '24px',
    fontWeight: '800',
  },
  tipBox: {
    backgroundColor: '#FEF3C7',
    padding: '20px',
    borderRadius: '14px',
    borderLeft: '4px solid #D97706',
    color: '#78350F',
    marginBottom: '24px',
    lineHeight: '1.6',
    fontSize: '15px',
  },
  exoBox: {
    backgroundColor: '#F8FAF8',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E4E4E7',
  },
  exoLabel: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    color: '#71717A',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  exoTitle: {
    margin: '0 0 4px 0',
    color: '#422006',
    fontSize: '20px',
    fontWeight: '700',
  },
  exoDuration: {
    fontSize: '13px',
    color: '#D97706',
    fontWeight: '600',
    margin: '0 0 20px 0',
  },
  resultButtons: {
    display: 'flex',
    gap: '12px',
  },
  playButton: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#14532D',
    color: '#FFFFFF',
    border: 'none',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.25)',
  },
  resetButton: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    border: 'none',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
  },
};

export default Humeur;
