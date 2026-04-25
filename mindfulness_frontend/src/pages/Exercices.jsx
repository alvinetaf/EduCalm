import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // 👈 NOUVEAU: Pour lire l'URL
import { Play, Pause, Clock, Volume2, Loader } from 'lucide-react';

const Exercices = () => {
  const [exercicesList, setExercicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExo, setActiveExo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);
  const location = useLocation(); // 👈 NOUVEAU: Capture l'URL actuelle

  const thumbnails = [
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=150&h=150&fit=crop"
  ];

  // 1. On récupère la liste des exercices au chargement de la page
  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const response = await axios.get('http://localhost/mindfulness_backend/get_exercises.php');
        if (response.data.success) {
          setExercicesList(response.data.data);
        }
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercices();
  }, []);

  // 2. 👈 NOUVEAU: On surveille si un ID a été passé dans l'URL (depuis Humeur)
  useEffect(() => {
    // On s'assure que la liste est bien chargée
    if (exercicesList.length > 0) {
      // On extrait l'ID de l'URL (ex: ?id=2)
      const queryParams = new URLSearchParams(location.search);
      const targetId = queryParams.get('id');

      if (targetId) {
        // On cherche l'exercice qui correspond à cet ID
        const exoToPlay = exercicesList.find(e => e.id.toString() === targetId);
        
        if (exoToPlay && activeExo?.id !== exoToPlay.id) {
          setActiveExo(exoToPlay);
          setIsPlaying(true);
          
          // Petit délai pour laisser React charger l'audio dans la balise <audio>
          setTimeout(() => {
            if (audioRef.current) {
              // On tente de lancer l'audio
              // Note: Le navigateur bloque parfois l'autoplay, le .catch évite les erreurs dans la console
              audioRef.current.play().catch(error => {
                console.log("Autoplay bloqué par le navigateur", error);
                setIsPlaying(false); // On remet sur pause visuellement si bloqué
              });
            }
          }, 500);
        }
      }
    }
  }, [exercicesList, location.search]); // S'exécute quand la liste charge ou quand l'URL change

  // La fonction manuelle reste la même
  const togglePlay = (exo) => {
    if (activeExo?.id !== exo.id) {
      setActiveExo(exo);
      setIsPlaying(true);
      setTimeout(() => audioRef.current.play(), 100);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tes séances</h1>
      <p style={styles.subtitle}>Choisis un programme pour t'apaiser.</p>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#78350F' }}>
          <Loader size={30} className="spinner" style={{ marginBottom: '10px' }} />
          <p>Chargement des séances...</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {exercicesList.map((exo, index) => (
            <div key={exo.id} style={styles.card}>
              
              <div style={styles.cardContentWrapper}>
                <img 
                  src={thumbnails[index % thumbnails.length]} 
                  alt={exo.title} 
                  style={styles.thumbnail} 
                />
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle}>{exo.title}</h3>
                  <p style={styles.cardDesc}>{exo.description}</p>
                  <div style={styles.cardMeta}>
                    <Clock size={12} color="#D97706" style={{ marginRight: '5px' }} />
                    <span>{exo.duration}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => togglePlay(exo)} 
                style={{
                  ...styles.playButton, 
                  backgroundColor: activeExo?.id === exo.id && isPlaying ? '#D97706' : '#14532D'
                }}
              >
                {activeExo?.id === exo.id && isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <audio ref={audioRef} src={activeExo?.audio_url} onEnded={() => setIsPlaying(false)} />

      {activeExo && (
        <div style={styles.floatingPlayer}>
          <Volume2 size={24} color="#FFFFFF" style={{ marginRight: '15px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' }}>
              En lecture : {activeExo.title}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#D1FAE5' }}>
              {isPlaying ? 'Respire profondément...' : 'En pause'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Tes styles restent exactement les mêmes ...
const styles = {
  container: { padding: '30px 20px', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFAF9', minHeight: '100vh' },
  title: { fontSize: '28px', color: '#422006', margin: '0 0 5px 0', fontWeight: '800' },
  subtitle: { fontSize: '15px', color: '#78350F', margin: '0 0 30px 0' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '100px' },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '15px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.08)', border: '1px solid #FEF3C7' },
  cardContentWrapper: { display: 'flex', alignItems: 'center', flex: 1, paddingRight: '10px' },
  thumbnail: { width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px', boxShadow: '0 4px 10px rgba(20, 83, 45, 0.15)', border: '2px solid #D1FAE5' },
  cardInfo: { flex: 1 },
  cardTitle: { margin: '0 0 5px 0', fontSize: '16px', color: '#14532D', fontWeight: '700' },
  cardDesc: { margin: '0 0 8px 0', fontSize: '12px', color: '#52525B', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardMeta: { display: 'flex', alignItems: 'center', fontSize: '11px', color: '#D97706', fontWeight: '700', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '12px', width: 'fit-content' },
  playButton: { width: '45px', height: '45px', borderRadius: '50%', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)' },
  floatingPlayer: { position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '440px', backgroundColor: '#14532D', border: 'none', borderRadius: '20px', padding: '15px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 25px rgba(20, 83, 45, 0.3)', zIndex: 900 }
};

export default Exercices;