// ═══════════════════════════════════════════════════════════════════
// FICHIER 1 : src/components/OfflineBanner.jsx
// Bannière qui s'affiche quand l'élève est hors ligne
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Download, CheckCircle } from 'lucide-react';

export const OfflineBanner = ({ onDownloadAll, cachedCount, totalWithAudio, allCached }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowBanner(false), 3000); // Cache la bannière 3s après reconnexion
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Affiche la bannière au premier rendu si hors ligne
    if (!navigator.onLine) setShowBanner(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: isOnline ? '#D1FAE5' : '#FEF3C7',
      borderBottom: `2px solid ${isOnline ? '#14532D' : '#D97706'}`,
      fontFamily: 'inherit',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    }}>
      {isOnline
        ? <Wifi size={18} color="#14532D" />
        : <WifiOff size={18} color="#D97706" />
      }
      <span style={{ flex: 1, color: isOnline ? '#14532D' : '#92400E', fontWeight: '500' }}>
        {isOnline
          ? '✅ Connexion rétablie'
          : `📵 Mode hors ligne — ${cachedCount}/${totalWithAudio} séances disponibles`
        }
      </span>
      {!isOnline && !allCached && onDownloadAll && (
        <button
          onClick={onDownloadAll}
          style={{
            padding: '6px 14px',
            backgroundColor: '#D97706',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Download size={14} /> Télécharger
        </button>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════
// FICHIER 2 : src/components/CacheIndicator.jsx
// Icône sur chaque carte d'exercice pour montrer si l'audio est dispo hors ligne
// ═══════════════════════════════════════════════════════════════════

export const CacheIndicator = ({ status, onCache }) => {
  if (status === 'cached') {
    return (
      <div title="Disponible hors ligne" style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: '11px', color: '#14532D', fontWeight: '600',
      }}>
        <CheckCircle size={14} color="#14532D" />
        <span>Hors ligne ✓</span>
      </div>
    );
  }

  if (status === 'downloading') {
    return (
      <div style={{
        fontSize: '11px', color: '#D97706', fontWeight: '600',
        display: 'flex', alignItems: 'center', gap: '4px',
      }}>
        <span className="spinner-small">⟳</span> En cours...
      </div>
    );
  }

  if (status === 'not_cached' && onCache) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onCache(); }}
        title="Télécharger pour hors ligne"
        style={{
          border: 'none',
          background: 'none',
          padding: '0',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '11px', color: '#9CA3AF',
        }}
      >
        <Download size={13} />
        <span>Enregistrer</span>
      </button>
    );
  }

  return null;
};


