import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Clock, Loader, Wind } from 'lucide-react';
import './Exercices.css';

// Tes imports d'images
import imageBodyScan from "../images/body_scan.jpg";
// import imageRespiration from "../images/respiration.jpg";
import imageMeditation from "../images/meditation.jpg";
import imageAttention from "../images/attention.jpg";
// import imageMarche from "../images/marche.jpg";

const Exercices = () => {
  const [exercicesList, setExercicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExo, setActiveExo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [breathText, setBreathText] = useState('Prêt(e) ? Clique sur Play.');
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const audioRef = useRef(null);
  const location = useLocation();

  const bodyScanSteps = [
    "1. Installe-toi confortablement. Garde le dos droit et relâche les épaules.",
    "2. Ferme les yeux et prends un moment pour sentir ton corps.",
    "3. Inspire profondément par le nez... et expire lentement.",
    "4. Porte ton attention sur tes pieds. Sens leur contact.",
    "5. Remonte doucement vers ton ventre. Sens-le se gonfler.",
    "6. Relâche tes épaules, ton cou, et les muscles de ton visage.",
    "7. Prends une dernière respiration... Tu peux ouvrir les yeux."
  ];

  // La fonction qui distribue les images
  const obtenirImagePourExercice = (titre) => {
    const titreMinuscule = titre.toLowerCase();
    
    if (titreMinuscule.includes('respiration')) {
      // Un lien internet direct vers une image apaisante
      return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop"; 
    } 
    else if (titreMinuscule.includes('méditation') || titreMinuscule.includes('meditation')) {
      return imageMeditation;
    } 
    else if (titreMinuscule.includes('scan') || titreMinuscule.includes('corps')) {
      return imageBodyScan; // On garde la belle image que tu as déjà mise dans ton dossier !
    } 
    else if (titreMinuscule.includes('marche')) {
      return "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop";
    }
    
    return imageAttention; 
  };

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

  useEffect(() => {
    let interval;
    let timeout1, timeout2;

    // SÉCURITÉ : On vérifie que activeExo existe avant de lire son titre
    const isRespiration = activeExo ? activeExo.title.toLowerCase().includes('respiration') : false;
    const isBodyScan = activeExo ? (activeExo.title.toLowerCase().includes('scan') || activeExo.title.toLowerCase().includes('corps')) : false;

    if (isPlaying) {
      if (isRespiration) {
        const runBreathCycle = () => {
          setBreathText('Inspire par le nez... (4s)');
          timeout1 = setTimeout(() => setBreathText('Retiens l\'air... (2s)'), 4000); 
          timeout2 = setTimeout(() => setBreathText('Expire lentement... (4s)'), 6000); 
        };
        runBreathCycle();
        interval = setInterval(runBreathCycle, 10000); 
      } 
      else if (isBodyScan) {
        interval = setInterval(() => {
          setScanStepIndex((prevIndex) => {
            if (prevIndex < bodyScanSteps.length - 1) {
              return prevIndex + 1;
            }
            return prevIndex;
          });
        }, 15000); // 15 secondes pour ton audio lent
      }
    } else {
      if (isRespiration) setBreathText('En pause. Clique sur Play.');
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isPlaying, activeExo]);

  const togglePlay = (exo) => {
    if (activeExo?.id !== exo.id) {
      setActiveExo(exo);
      setIsPlaying(true);
      setScanStepIndex(0);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
    setActiveExo(null);
    setScanStepIndex(0);
  };

  // LE FAMEUX RETURN QUI POSAIT PROBLÈME EST BIEN À L'INTÉRIEUR DE LA FONCTION MAINTENANT
  return (
    <div className="exercices-container">
      <div className="page-header">
        <h1 className="title">Tes séances</h1>
        <p className="subtitle">Choisis un programme pour t'apaiser.</p>
      </div>

      {isLoading ? (
        <div className="loading-wrapper">
          <Loader size={32} className="spinner" color="#D97706" style={{ marginBottom: '12px' }} />
          <p className="loading-text">Chargement des séances...</p>
        </div>
      ) : (
        <div className="grid">
          {exercicesList.map((exo) => {
            const isActive = activeExo?.id === exo.id;
            const isCurrentlyPlaying = isActive && isPlaying;

            return (
              <div 
                key={exo.id} 
                className="exo-card"
                onClick={() => togglePlay(exo)}
                style={{
                  borderColor: isActive ? '#14532D' : '#FEF3C7',
                  boxShadow: isActive ? '0 12px 32px rgba(20, 83, 45, 0.15)' : '0 8px 24px rgba(20, 83, 45, 0.04)',
                }}
              >
                <img
                  src={obtenirImagePourExercice(exo.title)}
                  alt={exo.title}
                  className="cover-image"
                  style={{ borderBottomColor: isActive ? '#D97706' : '#D1FAE5' }}
                />
                
                <div className="card-content">
                  <h3 className="card-title">{exo.title}</h3>
                  <p className="card-desc">{exo.description}</p>
                  
                  <div className="card-footer">
                    <div className="card-meta">
                      <Clock size={14} color="#D97706" style={{ marginRight: '6px' }} />
                      <span>{exo.duration}</span>
                    </div>
                    
                    <button
                      className="play-button"
                      style={{
                        backgroundColor: isCurrentlyPlaying ? '#D97706' : '#14532D',
                        width: '44px',
                        height: '44px',
                      }}
                    >
                      {isCurrentlyPlaying
                        ? <Pause size={20} color="white" />
                        : <Play size={20} color="white" style={{ marginLeft: '2px' }} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <audio ref={audioRef} src={activeExo?.audio_url} onEnded={() => setIsPlaying(false)} />

      {activeExo && (
        <div className="fullscreen-player">
          <button className="close-btn" onClick={closePlayer}>Fermer X</button>

          <div className="player-header">
            <h2 className="player-title-large">{activeExo.title}</h2>
          </div>

          {activeExo.title.toLowerCase().includes('respiration') ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`breathing-circle-large ${isPlaying ? 'is-breathing-large' : ''}`}>
                 <Wind size={64} color={isPlaying ? "#D97706" : "#34D399"} />
              </div>
              <p className="breath-instruction">{breathText}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={obtenirImagePourExercice(activeExo.title)} 
                alt="Méditation" 
                className="meditation-image"
              />
              <div className="meditation-text-container" style={{ marginTop: '20px', minHeight: '120px', display: 'flex', alignItems: 'center' }}>
                <div className="meditation-step" style={{ margin: 0, fontSize: '22px', textAlign: 'center', fontWeight: '600' }}>
                  {bodyScanSteps[scanStepIndex]}
                </div>
              </div>
            </div>
          )}

          <div className="controls-large" style={{ marginTop: '40px' }}>
            <button onClick={() => togglePlay(activeExo)} className="player-toggle-large">
              {isPlaying
                ? <Pause size={36} color="#FFFFFF" />
                : <Play size={36} color="#FFFFFF" style={{ marginLeft: '6px' }} />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; // C'est ici que la fonction se ferme, TOUT à la fin !

export default Exercices;