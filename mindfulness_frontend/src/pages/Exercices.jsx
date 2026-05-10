

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Clock, Loader, Wind, Download, CheckCircle, WifiOff } from 'lucide-react';
import { useOfflineAudio } from '../hooks/useOfflineAudio';
import './Exercices.css';

import imageBodyScan from "../images/body_scan.jpg";
import imageRespiration from "../images/respiration.jpg";
import imageMeditation from "../images/meditation.jpg";
import imageAttention from "../images/attention.jpg";
import imageMarche from "../images/marche.jpg";

// ─── Composant : Bannière hors ligne ────────────────────────────────────────
const OfflineBanner = ({ onDownloadAll, cachedCount, totalWithAudio, allCached }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visible, setVisible] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => { setIsOnline(true); setTimeout(() => setVisible(false), 3000); };
    const onOffline = () => { setIsOnline(false); setVisible(true); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: isOnline ? '#D1FAE5' : '#FEF3C7',
      borderBottom: `2px solid ${isOnline ? '#14532D' : '#D97706'}`,
      fontSize: '14px', fontFamily: 'inherit',
    }}>
      {isOnline
        ? <CheckCircle size={18} color="#14532D" />
        : <WifiOff size={18} color="#D97706" />
      }
      <span style={{ flex: 1, color: isOnline ? '#14532D' : '#92400E', fontWeight: '500' }}>
        {isOnline
          ? '✅ Connexion rétablie'
          : `📵 Hors ligne — ${cachedCount}/${totalWithAudio} séances disponibles`
        }
      </span>
      {!isOnline && !allCached && (
        <button onClick={onDownloadAll} style={{
          padding: '6px 14px', backgroundColor: '#D97706', color: 'white',
          border: 'none', borderRadius: '20px', fontSize: '13px',
          fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Download size={14} /> Télécharger tout
        </button>
      )}
    </div>
  );
};

// ─── Composant : Badge de cache sur chaque carte ─────────────────────────────
const CacheIndicator = ({ status, onCache }) => {
  if (status === 'cached') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#14532D', fontWeight: '600' }}>
      <CheckCircle size={13} color="#14532D" /> Hors ligne ✓
    </div>
  );
  if (status === 'downloading') return (
    <span style={{ fontSize: '11px', color: '#D97706' }}>⟳ Téléchargement...</span>
  );
  if (status === 'not_cached') return (
    <button onClick={(e) => { e.stopPropagation(); onCache(); }} style={{
      border: 'none', background: 'none', padding: 0, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9CA3AF',
    }}>
      <Download size={13} /> Enregistrer
    </button>
  );
  return null;
};

// ─── Composant principal ─────────────────────────────────────────────────────
const Exercices = () => {
  const [exercicesList, setExercicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExo, setActiveExo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [breathText, setBreathText] = useState('Prêt(e) ? Clique sur Play.');
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [walkingStepIndex, setWalkingStepIndex] = useState(0);
  const [focusStepIndex, setFocusStepIndex] = useState(0);

  const audioRef = useRef(null);
  const location = useLocation();

  // ✅ NOUVEAU : hook de gestion du cache offline
  const {
    cacheStatus,
    cacheAudio,
    cacheAllAudios,
    cachedCount,
    totalWithAudio,
    allCached,
  } = useOfflineAudio(exercicesList);

  const bodyScanSteps = [
    "1. Installe-toi confortablement. Garde le dos droit et relâche les épaules.",
    "2. Ferme les yeux et prends un moment pour sentir ton corps.",
    "3. Inspire profondément par le nez... et expire lentement.",
    "4. Porte ton attention sur tes pieds. Sens leur contact.",
    "5. Remonte doucement vers ton ventre. Sens-le se gonfler.",
    "6. Relâche tes épaules, ton cou, et les muscles de ton visage.",
    "7. Prends une dernière respiration... Tu peux ouvrir les yeux."
  ];

  const walkingSteps = [
    "1. Tiens-toi debout calmement et relâche les épaules.",
    "2. Inspire profondément... puis expire lentement.",
    "3. Commence à marcher doucement, sans te presser.",
    "4. Sens le contact de tes pieds avec le sol.",
    "5. Observe le mouvement de ton corps à chaque pas.",
    "6. Si ton esprit se disperse, ramène doucement ton attention à la marche.",
    "7. Écoute les sons autour de toi sans les juger.",
    "8. Ressens ta respiration pendant le mouvement.",
    "9. Continue quelques instants dans le calme.",
    "10. Arrête-toi doucement et remercie-toi pour ce moment."
  ];
  const focusSteps = [
    "1. Assieds-toi calmement et garde le dos droit.",
    
    "2. Pose tes mains doucement sur tes jambes.",
    
    "3. Respire lentement par le nez.",
    
    "4. Choisis un seul point d’attention : ta respiration.",
    
    "5. Sens l’air entrer puis sortir.",
    
    "6. Si une pensée arrive, ce n’est pas grave.",
    
    "7. Ramène doucement ton attention à ta respiration.",
    
    "8. Écoute simplement le moment présent.",
    
    "9. Ton esprit devient plus calme et plus concentré.",
    
    "10. Prends une dernière respiration profonde."
  ];

  const obtenirImagePourExercice = (titre) => {
    const t = titre.toLowerCase();
    if (t.includes('respiration')) return imageRespiration;
    if (t.includes('méditation') || t.includes('meditation')) return imageMeditation;
    if (t.includes('scan') || t.includes('corps')) return imageBodyScan;
    if (t.includes('marche')) return imageMarche;
    return imageAttention;
  };

  useEffect(() => {
    const fetchExercices = async () => {
      try {
        // ✅ URL relative grâce au proxy Vite (plus de http://localhost:80)
        const response = await axios.get('/mindfulness_backend/get_exercises.php');
        if (response.data.success) setExercicesList(response.data.data);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercices();
  }, []);

  useEffect(() => {
    let interval, timeout1, timeout2;
    const isRespiration = activeExo?.title.toLowerCase().includes('respiration');
    const isBodyScan = activeExo?.title.toLowerCase().includes('scan') || activeExo?.title.toLowerCase().includes('corps');
    const isWalking = activeExo?.title.toLowerCase().includes('marche');
    const isFocus = activeExo? activeExo.title.toLowerCase().includes('attention'): false;

    if (isPlaying) {
      if (isRespiration) {
        const runBreathCycle = () => {
          setBreathText('Inspire par le nez... (4s)');
          timeout1 = setTimeout(() => setBreathText("Retiens l'air... (2s)"), 4000);
          timeout2 = setTimeout(() => setBreathText('Expire lentement... (4s)'), 6000);
        };
        runBreathCycle();
        interval = setInterval(runBreathCycle, 10000);
      } else if (isBodyScan) {
        interval = setInterval(() => {
          setScanStepIndex((prev) => prev < bodyScanSteps.length - 1 ? prev + 1 : prev);
        }, 15000);
      } else if (isWalking) {
        interval = setInterval(() => {
          setWalkingStepIndex((prev) => prev < walkingSteps.length - 1 ? prev + 1 : prev);
        }, 12000);
      }
      else if (isFocus) {
        interval = setInterval(() => {
          setFocusStepIndex((prevIndex) => {
            if (prevIndex < focusSteps.length - 1) {
              return prevIndex + 1;
            }
            return prevIndex;
          });
        }, 10000);
      }
    } else {
      if (isRespiration) setBreathText('En pause. Clique sur Play.');
    }

    return () => { clearInterval(interval); clearTimeout(timeout1); clearTimeout(timeout2); };
  }, [isPlaying, activeExo]);

  const togglePlay = (exo) => {
    if (activeExo?.id !== exo.id) {
      setActiveExo(exo);
      setIsPlaying(true);
      setScanStepIndex(0);
      setWalkingStepIndex(0);

      // ✅ NOUVEAU : mise en cache automatique à la 1ère écoute
      if (cacheStatus[exo.id] === 'not_cached') {
        cacheAudio(exo);
      }

      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play(); setIsPlaying(true); }
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
    setActiveExo(null);
    setScanStepIndex(0);
    setWalkingStepIndex(0);
  };

  // ✅ Normalise l'URL audio pour utiliser le proxy (chemin relatif)
  const getAudioSrc = (audioUrl) => {
    if (!audioUrl) return null;
    return audioUrl.replace(/^https?:\/\/localhost(:\d+)?/, '');
  };

  return (
    <>
      {/* ✅ NOUVEAU : Bannière hors ligne */}
      <OfflineBanner
        onDownloadAll={cacheAllAudios}
        cachedCount={cachedCount}
        totalWithAudio={totalWithAudio}
        allCached={allCached}
      />

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

                      {/* ✅ NOUVEAU : indicateur de cache */}
                      <CacheIndicator
                        status={cacheStatus[exo.id]}
                        onCache={() => cacheAudio(exo)}
                      />

                      <button
                        className="play-button"
                        style={{
                          backgroundColor: isCurrentlyPlaying ? '#D97706' : '#14532D',
                          width: '44px', height: '44px',
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

        {/* ✅ src normalisé pour passer par le proxy */}
        <audio
          ref={audioRef}
          src={getAudioSrc(activeExo?.audio_url)}
          onEnded={() => setIsPlaying(false)}
        />

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

            ) : activeExo.title.toLowerCase().includes('marche') ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={obtenirImagePourExercice(activeExo.title)} alt="Marche consciente" className="meditation-image" />
                <div style={{ marginTop: '20px', background: '#ffffffcc', padding: '20px', borderRadius: '20px', maxWidth: '700px' }}>
                  <p style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center', color: '#14532D', lineHeight: '1.8' }}>
                    {walkingSteps[walkingStepIndex]}
                  </p>
                </div>
              </div>

            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={obtenirImagePourExercice(activeExo.title)} alt="Méditation" className="meditation-image" />
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
    </>
  );
};

export default Exercices;
