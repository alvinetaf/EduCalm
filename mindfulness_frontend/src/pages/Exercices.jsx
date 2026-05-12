// src/pages/Exercices.jsx — EduCalm
// Corrections : état meditationStepIndex déclaré, détection accent 'méditation',
// textes avec tonalité africaine camerounaise

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Clock, Loader, Wind, Download, CheckCircle, WifiOff } from 'lucide-react';
import { useOfflineAudio } from '../hooks/useOfflineAudio';
import { API } from '../config/api';
import './Exercices.css';

import imageBodyScan    from "../images/body_scan.jpg";
import imageRespiration from "../images/respiration.jpg";
import imageMeditation  from "../images/meditation.jpg";
import imageAttention   from "../images/attention.jpg";
import imageMarche      from "../images/marche.jpg";

// ─── Bannière hors ligne ──────────────────────────────────────────────────────
const OfflineBanner = ({ onDownloadAll, cachedCount, totalWithAudio, allCached }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [visible, setVisible]   = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline  = () => { setIsOnline(true);  setTimeout(() => setVisible(false), 3000); };
    const onOffline = () => { setIsOnline(false); setVisible(true); };
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
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
      {isOnline ? <CheckCircle size={18} color="#14532D" /> : <WifiOff size={18} color="#D97706" />}
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

// ─── Badge de cache ───────────────────────────────────────────────────────────
const CacheIndicator = ({ status, onCache }) => {
  if (status === 'cached') return (
    <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:'#14532D', fontWeight:'600' }}>
      <CheckCircle size={13} color="#14532D" /> Hors ligne ✓
    </div>
  );
  if (status === 'downloading') return (
    <span style={{ fontSize:'11px', color:'#D97706' }}>⟳ Téléchargement...</span>
  );
  if (status === 'not_cached') return (
    <button
      onClick={(e) => { e.stopPropagation(); onCache(); }}
      style={{ border:'none', background:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:'#9CA3AF' }}
    >
      <Download size={13} /> Enregistrer
    </button>
  );
  return null;
};

// ─── Composant principal ──────────────────────────────────────────────────────
const Exercices = () => {
  const [exercicesList, setExercicesList]       = useState([]);
  const [isLoading, setIsLoading]               = useState(true);
  const [activeExo, setActiveExo]               = useState(null);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [breathText, setBreathText]             = useState('Prêt(e) ? Clique sur Play.');
  const [scanStepIndex, setScanStepIndex]       = useState(0);
  const [walkingStepIndex, setWalkingStepIndex] = useState(0);
  // ✅ CORRECTION : état déclaré correctement
  const [meditationStepIndex, setMeditationStepIndex] = useState(0);

  const audioRef = useRef(null);
  const location = useLocation();

  const { cacheStatus, cacheAudio, cacheAllAudios, cachedCount, totalWithAudio, allCached } =
    useOfflineAudio(exercicesList);

  // ─── Textes avec tonalité africaine camerounaise ───────────────────────────

  const bodyScanSteps = [
    "🌿 Pose-toi, mon ami(e). Comme l'arbre qui s'enracine dans la terre rouge de nos collines.",
    "🙏 Ferme doucement les yeux. Tu es en sécurité. Laisse ton corps se souvenir du calme.",
    "🌬️ Inspire lentement par le nez... comme si tu respirais l'air frais de la forêt de Bafoussam.",
    "👣 Porte ton attention sur tes pieds. Ces pieds qui ont marché, couru, porté tant de choses.",
    "💚 Remonte vers ton ventre. Sens-le qui se soulève doucement, comme les vagues du Wouri.",
    "🌅 Relâche les épaules. Dépose le poids des cours et des devoirs. Ce n'est plus l'heure.",
    "✨ Prends une dernière grande respiration... Tu peux ouvrir les yeux. Tu es plus calme qu'avant.",
  ];

  const walkingSteps = [
    "🌳 Tiens-toi debout, la tête haute. Comme nos anciens marchaient avec dignité.",
    "🌬️ Inspire profondément... puis laisse sortir l'air lentement. Ton corps sait se calmer.",
    "👣 Commence à marcher, doucement, sans te presser. Chaque pas compte.",
    "🌱 Sens tes pieds toucher la terre. Ce contact te relie à quelque chose de grand.",
    "🎶 Observe le balancement naturel de ton corps. Tu es en mouvement, tu es vivant(e).",
    "🍃 Si des pensées de classe arrivent, dis-leur : 'Pas maintenant.' Et reviens à tes pas.",
    "👂 Écoute les sons autour de toi — les voix, les oiseaux, la vie qui continue.",
    "💨 Ressens ta respiration qui s'ajuste au mouvement. Ton corps est sage.",
    "🌄 Continue quelques instants. Tu mérites cette pause. Tu mérites ce calme.",
    "🙏 Arrête-toi doucement. Remercie ton corps. Remercie ce moment. Tu as bien fait.",
  ];

  const meditationSteps = [
    "🌿 Installe-toi bien. Comme quand on s'assoit pour écouter un ancien raconter une histoire.",
    "😌 Ferme les yeux si tu le veux. Tu es en sécurité ici. Personne ne te juge.",
    "🌬️ Inspire lentement par le nez... et expire par la bouche. Recommence, doucement.",
    "💚 Sens ton corps devenir lourd, détendu. Comme après un bon repas partagé en famille.",
    "🎯 Porte maintenant ton attention sur ta respiration. Juste ça. Rien d'autre.",
    "🍃 Observe l'air qui entre... et qui sort. Tu n'as rien à faire. Juste être là.",
    "💭 Si des pensées arrivent — les cours, les examens — laisse-les passer comme des nuages.",
    "🌀 Ramène doucement ton attention à ta respiration. Sans te gronder. Tu fais bien.",
    "🌅 Sens le calme s'installer en toi. Comme le silence avant l'aube sur nos montagnes.",
    "✨ Prends une grande respiration... et ouvre doucement les yeux. Bienvenue au calme.",
  ];

  const attentionSteps = [
    "🎯 Pose les deux pieds à plat sur le sol. Sens leur contact ferme avec la terre.",
    "👀 Regarde autour de toi. Nomme mentalement 5 choses que tu vois.",
    "👂 Maintenant ferme les yeux. Écoute. Nomme 4 sons que tu entends.",
    "🤲 Touche quelque chose près de toi. Sens sa texture, sa température.",
    "👃 Inspire doucement. Quelle odeur perçois-tu ? Ne juge pas. Observe.",
    "💚 Tu es ici. Tu es présent(e). Ton esprit se pose comme un oiseau sur une branche.",
    "🌬️ Prends 3 respirations lentes et profondes. Tu reprends le contrôle.",
    "✨ Ouvre les yeux. Tu es calme, concentré(e), prêt(e) à avancer.",
  ];

  // ─── Textes de respiration (gérés par interval, pas par array) ────────────
  // breathText est mis à jour dynamiquement dans useEffect

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const titre = (t = '') => t.toLowerCase();

  const isRespiration = (t) => titre(t).includes('respiration');
  // ✅ CORRECTION : on cherche 'ditation' pour couvrir 'Méditation' et 'meditation'
  const isMeditation  = (t) => titre(t).includes('ditation');
  const isBodyScan    = (t) => titre(t).includes('scan') || titre(t).includes('corps') || titre(t).includes('body');
  const isWalking     = (t) => titre(t).includes('marche');
  const isAttention   = (t) => titre(t).includes('attention');

  const obtenirImagePourExercice = (t = '') => {
    if (isRespiration(t)) return imageRespiration;
    if (isMeditation(t))  return imageMeditation;
    if (isBodyScan(t))    return imageBodyScan;
    if (isWalking(t))     return imageMarche;
    return imageAttention;
  };

  const getStepsForExo = (t = '') => {
    if (isBodyScan(t))   return bodyScanSteps;
    if (isWalking(t))    return walkingSteps;
    if (isMeditation(t)) return meditationSteps;
    if (isAttention(t))  return attentionSteps;
    return bodyScanSteps;
  };

  const getCurrentStepIndex = (t = '') => {
    if (isBodyScan(t))   return scanStepIndex;
    if (isWalking(t))    return walkingStepIndex;
    if (isMeditation(t)) return meditationStepIndex;
    if (isAttention(t))  return meditationStepIndex; // réutilise le même index
    return scanStepIndex;
  };

  // ─── Fetch exercices ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const response = await axios.get(API.GET_EXERCISES);
        if (response.data.success) setExercicesList(response.data.data);
      } catch (error) {
        console.error("Erreur API exercices :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercices();
  }, []);

  // ─── Scroll vers l'exercice recommandé ────────────────────────────────────
  useEffect(() => {
    const params  = new URLSearchParams(location.search);
    const idCible = params.get('id');
    if (idCible && exercicesList.length > 0) {
      const exo = exercicesList.find(e => String(e.id) === String(idCible));
      if (exo) {
        setTimeout(() => {
          document.getElementById(`exo-${exo.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location.search, exercicesList]);

  // ─── Gestion des timers d'exercice ────────────────────────────────────────
  useEffect(() => {
    let interval, timeout1, timeout2;
    const t = activeExo?.title || '';

    if (isPlaying) {
      if (isRespiration(t)) {
        const runCycle = () => {
          setBreathText('🌬️ Inspire par le nez... (4 secondes)');
          timeout1 = setTimeout(() => setBreathText("⏸️ Retiens l'air... (2 secondes)"), 4000);
          timeout2 = setTimeout(() => setBreathText('😮‍💨 Expire lentement... (4 secondes)'), 6000);
        };
        runCycle();
        interval = setInterval(runCycle, 10000);
      } else if (isBodyScan(t)) {
        interval = setInterval(() =>
          setScanStepIndex(p => p < bodyScanSteps.length - 1 ? p + 1 : p), 15000);
      } else if (isWalking(t)) {
        interval = setInterval(() =>
          setWalkingStepIndex(p => p < walkingSteps.length - 1 ? p + 1 : p), 12000);
      } else if (isMeditation(t) || isAttention(t)) {
        // ✅ CORRECTION : setMeditationStepIndex (minuscule)
        interval = setInterval(() =>
          setMeditationStepIndex(p => p < meditationSteps.length - 1 ? p + 1 : p), 12000);
      }
    } else {
      if (isRespiration(t)) setBreathText('En pause. Clique sur Play pour reprendre.');
    }

    return () => { clearInterval(interval); clearTimeout(timeout1); clearTimeout(timeout2); };
  }, [isPlaying, activeExo]);

  // ─── Contrôles ────────────────────────────────────────────────────────────
  const togglePlay = (exo) => {
    if (activeExo?.id !== exo.id) {
      setActiveExo(exo);
      setIsPlaying(true);
      setScanStepIndex(0);
      setWalkingStepIndex(0);
      // ✅ CORRECTION : minuscule
      setMeditationStepIndex(0);
      if (cacheStatus[exo.id] === 'not_cached') cacheAudio(exo);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else           { audioRef.current?.play();  setIsPlaying(true);  }
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
    setActiveExo(null);
    setScanStepIndex(0);
    setWalkingStepIndex(0);
    setMeditationStepIndex(0);
  };

  const getAudioSrc = (audioUrl) => {
    if (!audioUrl) return null;
    if (import.meta.env.DEV) return audioUrl.replace(/^https?:\/\/localhost(:\d+)?/, '');
    return audioUrl;
  };

  // ─── Rendu du player immersif selon l'exercice ────────────────────────────
  const renderPlayerContent = () => {
    if (!activeExo) return null;
    const t = activeExo.title;

    if (isRespiration(t)) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div className={`breathing-circle-large ${isPlaying ? 'is-breathing-large' : ''}`}>
            <Wind size={64} color={isPlaying ? "#D97706" : "#34D399"} />
          </div>
          <p className="breath-instruction">{breathText}</p>
          <p style={{ color:'#6EE7B7', fontSize:'14px', marginTop:'16px', fontStyle:'italic' }}>
            🌍 Technique 4-2-4 · Pratiquée dans le monde entier
          </p>
        </div>
      );
    }

    // Tous les autres exercices : image + textes progressifs
    const steps       = getStepsForExo(t);
    const stepIndex   = getCurrentStepIndex(t);
    const currentStep = steps[stepIndex];
    const progress    = Math.round(((stepIndex + 1) / steps.length) * 100);

    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%', maxWidth:'700px', padding:'0 24px' }}>

        {/* Image ronde */}
        <img
          src={obtenirImagePourExercice(t)}
          alt={t}
          className="meditation-image"
          style={{ marginBottom: '32px' }}
        />

        {/* Barre de progression des étapes */}
        <div style={{ width:'100%', marginBottom:'24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
            <span style={{ fontSize:'12px', color:'#6EE7B7', fontWeight:'600' }}>
              Étape {stepIndex + 1} / {steps.length}
            </span>
            <span style={{ fontSize:'12px', color:'#6EE7B7', fontWeight:'600' }}>
              {progress}%
            </span>
          </div>
          <div style={{ width:'100%', height:'4px', backgroundColor:'rgba(255,255,255,0.15)', borderRadius:'2px' }}>
            <div style={{
              width:`${progress}%`, height:'100%',
              backgroundColor:'#D97706', borderRadius:'2px',
              transition:'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Texte de l'étape courante */}
        <div className="meditation-text-container" style={{ width:'100%' }}>
          <p className="meditation-step" style={{
            margin: 0,
            fontSize: '22px',
            textAlign: 'center',
            fontWeight: '600',
            lineHeight: '1.7',
            animation: 'fadeIn 0.6s ease',
          }}>
            {currentStep}
          </p>
        </div>

        {/* Points de navigation */}
        <div style={{ display:'flex', gap:'8px', marginTop:'24px', flexWrap:'wrap', justifyContent:'center' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === stepIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === stepIndex ? '#D97706' : i < stepIndex ? '#6EE7B7' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => {
              // Permet de naviguer manuellement entre les étapes
              if (isBodyScan(t))   setScanStepIndex(i);
              else if (isWalking(t)) setWalkingStepIndex(i);
              else setMeditationStepIndex(i);
            }}
            />
          ))}
        </div>

      </div>
    );
  };

  // ─── JSX principal ─────────────────────────────────────────────────────────
  return (
    <>
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
            <Loader size={32} className="spinner" color="#D97706" style={{ marginBottom:'12px' }} />
            <p className="loading-text">Chargement des séances...</p>
          </div>
        ) : (
          <div className="grid">
            {exercicesList.map((exo) => {
              const isActive           = activeExo?.id === exo.id;
              const isCurrentlyPlaying = isActive && isPlaying;
              return (
                <div
                  id={`exo-${exo.id}`}
                  key={exo.id}
                  className="exo-card"
                  onClick={() => togglePlay(exo)}
                  style={{
                    borderColor: isActive ? '#14532D' : '#FEF3C7',
                    boxShadow: isActive
                      ? '0 12px 32px rgba(20,83,45,0.15)'
                      : '0 8px 24px rgba(20,83,45,0.04)',
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
                        <Clock size={14} color="#D97706" style={{ marginRight:'6px' }} />
                        <span>{exo.duration}</span>
                      </div>
                      <CacheIndicator status={cacheStatus[exo.id]} onCache={() => cacheAudio(exo)} />
                      <button
                        className="play-button"
                        style={{
                          backgroundColor: isCurrentlyPlaying ? '#D97706' : '#14532D',
                          width:'44px', height:'44px',
                        }}
                      >
                        {isCurrentlyPlaying
                          ? <Pause size={20} color="white" />
                          : <Play  size={20} color="white" style={{ marginLeft:'2px' }} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <audio
          ref={audioRef}
          src={getAudioSrc(activeExo?.audio_url)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* ─── Player immersif ─────────────────────────────────────────── */}
        {activeExo && (
          <div className="fullscreen-player">
            <button className="close-btn" onClick={closePlayer}>Fermer ✕</button>

            <div className="player-header">
              <h2 className="player-title-large">{activeExo.title}</h2>
              <p style={{ color:'#6EE7B7', margin:0, fontSize:'15px', fontStyle:'italic' }}>
                🌍 EduCalm · Ton espace de sérénité
              </p>
            </div>

            {renderPlayerContent()}

            <div className="controls-large" style={{ marginTop:'40px' }}>
              <button onClick={() => togglePlay(activeExo)} className="player-toggle-large">
                {isPlaying
                  ? <Pause size={36} color="#FFFFFF" />
                  : <Play  size={36} color="#FFFFFF" style={{ marginLeft:'6px' }} />
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