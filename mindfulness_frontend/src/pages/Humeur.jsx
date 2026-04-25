import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import questionsPsy from '../questions.json'; // Le bon chemin !

const Humeur = () => {
  const navigate = useNavigate();
  
  // 1. DÉCLARATION DES VARIABLES D'ÉTAT (Très important !)
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [reponses, setReponses] = useState([]);
  const [resultatApi, setResultatApi] = useState(null);
  const [enChargement, setEnChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  // 2. FONCTION DE REDIRECTION
  const lancerExercice = (idExo) => {
    // Redirige vers la page exercices avec l'ID
    navigate(`/exercices?id=${idExo}`);
  };

  /// 3. LOGIQUE DU QUESTIONNAIRE
const handleSelection = async (points) => {
  const nouvellesReponses = [...reponses, points];
  
  if (indexQuestion < questionsPsy.length - 1) {
    // On avance à la question suivante
    setReponses(nouvellesReponses);
    setIndexQuestion(indexQuestion + 1);
  } else {
    // Fin du questionnaire, on interroge l'API
    setEnChargement(true);
    try {
      
      // 👇 1. RÉCUPÉRATION DE L'ID (Assure-toi que la clé s'appelle bien 'userId' ou 'id')
      const monIdEleve = localStorage.getItem('userId'); 

      // Petit message dans la console pour vérifier que ça marche
      console.log("ID envoyé à PHP :", monIdEleve);

      // 👇 2. ENVOI AVEC L'ID INCLUS
      const response = await axios.post('http://localhost/mindfulness_backend/evaluate_stress.php', {
        reponses: nouvellesReponses,
        user_id: monIdEleve // ✅ L'ID est maintenant envoyé !
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

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bilan Émotionnel</h1>

      {enChargement && <p style={styles.texteAttente}>Analyse en cours par EduCalm...</p>}
      
      {erreur && <p style={{ color: 'red', textAlign: 'center' }}>{erreur}</p>}

      {/* VUE 1 : LE QUESTIONNAIRE SÉQUENTIEL */}
      {!resultatApi && !enChargement && !erreur && (
        <div style={styles.card}>
          <p style={styles.compteur}>Question {indexQuestion + 1} / {questionsPsy.length}</p>
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
      )}

      {/* VUE 2 : LE RÉSULTAT FOURNI PAR L'API */}
      {resultatApi && (
        <div style={styles.resultCard}>
          <h2 style={{ color: '#14532D', marginBottom: '10px' }}>Diagnostic terminé</h2>
          
          <div style={styles.tipBox}>
            <strong>Conseil :</strong> <br/>
            {resultatApi.conseil}
          </div>

          <div style={styles.exoBox}>
            <p style={{ margin: '0 0 10px 0' }}>Nous te recommandons cet exercice :</p>
            <h3 style={{ margin: '0 0 5px 0', color: '#422006' }}>{resultatApi.exercice.title}</h3>
            <p style={{ fontSize: '12px', color: '#78350F' }}>Durée : {resultatApi.exercice.duration} min</p>
            
            
            <button 
              style={styles.playButton} 
              onClick={() => lancerExercice(resultatApi.exercice.id)}
            >
              Lancer l'exercice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '30px 20px', minHeight: '100vh', backgroundColor: '#FAFAF9', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { fontSize: '24px', color: '#422006', marginBottom: '20px', fontWeight: '800' },
  card: { width: '100%', maxWidth: '400px', backgroundColor: '#FFF', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  compteur: { fontSize: '12px', color: '#94A3B8', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 'bold' },
  questionText: { fontSize: '16px', color: '#422006', marginBottom: '20px', fontWeight: '600', lineHeight: '1.4' },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionButton: { padding: '16px', borderRadius: '12px', border: '1px solid #D1FAE5', backgroundColor: '#F0FDF4', color: '#14532D', fontSize: '15px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' },
  texteAttente: { color: '#D97706', fontWeight: 'bold' },
  resultCard: { width: '100%', maxWidth: '400px', animation: 'fadeIn 0.5s' },
  tipBox: { backgroundColor: '#FEF3C7', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #D97706', color: '#78350F', marginBottom: '20px', lineHeight: '1.5' },
  exoBox: { backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E4E4E7', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  playButton: { width: '100%', padding: '15px', marginTop: '10px', borderRadius: '12px', backgroundColor: '#14532D', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }
};

export default Humeur;