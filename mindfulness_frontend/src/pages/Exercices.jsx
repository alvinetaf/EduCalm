import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Clock, Loader, Wind } from 'lucide-react';
import './Exercices.css';

const Exercices = () => {
  const [exercicesList, setExercicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExo, setActiveExo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Texte qui s'affichera sous l'icône
  const [breathText, setBreathText] = useState('Prêt(e) ? Clique sur Play.');

  const audioRef = useRef(null);
  const location = useLocation();

  const thumbnails = [
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop",
  ];

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

  // Synchronisation du texte sous l'icône
  useEffect(() => {
    let interval;
    let timeout1, timeout2;

    const isRespiration = activeExo?.title.toLowerCase().includes('respiration');

    if (isPlaying && isRespiration) {
      const runCycle = () => {
        setBreathText('Inspire par le nez...');
        timeout1 = setTimeout(() => {
          setBreathText('Retiens l\'air...');
        }, 4000); 
        timeout2 = setTimeout(() => {
          setBreathText('Expire lentement...');
        }, 6000); 
      };

      runCycle();
      interval = setInterval(runCycle, 10000); 
    } else if (!isPlaying && isRespiration) {
      setBreathText('En pause. Clique sur Play.');
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
  };

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
          {exercicesList.map((exo, index) => {
            const isActive = activeExo?.id === exo.id;
            const isCurrentlyPlaying = isActive && isPlaying;

            return (
              <div 
                key={exo.id} 
                className="exo-card"
                onClick={() => togglePlay(exo)}
                style={{
                  borderColor: isActive ? '#14532D' : '#FEF3C7',
                  boxShadow: isActive ? '0 8px 25px rgba(20, 83, 45, 0.15)' : '0 4px 15px rgba(217, 119, 6, 0.06)',
                }}
              >
                <img
                  src={thumbnails[index % thumbnails.length]}
                  alt={exo.title}
                  className="thumbnail"
                  style={{ borderColor: isActive ? '#D97706' : '#D1FAE5' }}
                />
                <div className="card-info">
                  <h3 className="card-title">{exo.title}</h3>
                  <p className="card-desc">{exo.description}</p>
                  <div className="card-meta">
                    <Clock size={12} color="#D97706" style={{ marginRight: '5px' }} />
                    <span>{exo.duration} min</span>
                  </div>
                </div>
                
                <button
                  className="play-button"
                  style={{
                    backgroundColor: isCurrentlyPlaying ? '#D97706' : '#14532D',
                  }}
                >
                  {isCurrentlyPlaying
                    ? <Pause size={20} color="white" />
                    : <Play size={20} color="white" style={{ marginLeft: '2px' }} />
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* LECTEUR AUDIO CACHÉ (Qui lira tes MP3 IA) */}
      <audio ref={audioRef} src={activeExo?.audio_url} onEnded={() => setIsPlaying(false)} />

      {/* LECTEUR PLEIN ÉCRAN */}
      {activeExo && (
        <div className="fullscreen-player">
          <button className="close-btn" onClick={closePlayer}>Fermer X</button>

          <div className="player-header">
            <h2 className="player-title-large">{activeExo.title}</h2>
          </div>

          {activeExo.title.toLowerCase().includes('respiration') ? (
            /* VISUEL RESPIRATION : CERCLE + TEXTE JUSTE EN DESSOUS */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`breathing-circle-large ${isPlaying ? 'is-breathing-large' : ''}`}>
                 <Wind size={64} color={isPlaying ? "#D97706" : "#34D399"} />
              </div>
              <p className="breath-instruction" style={{ marginTop: '10px' }}>{breathText}</p>
            </div>
          ) : (
            /* VISUEL MÉDITATION : IMAGE + TEXTE FIXE EN DESSOUS */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop" 
                alt="Méditation" 
                className="meditation-image"
              />
              <div className="meditation-text-container" style={{ marginTop: '20px' }}>
                <div className="meditation-step"><strong>1.</strong> Installez-vous confortablement et fermez les yeux.</div>
                <div className="meditation-step"><strong>2.</strong> Laissez-vous guider par l'audio.</div>
                <div className="meditation-step"><strong>3.</strong> Laissez passer vos pensées sans vous juger.</div>
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
};

export default Exercices;