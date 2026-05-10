// src/hooks/useOfflineAudio.js — EduCalm (VERSION CORRIGÉE)
//
// Pourquoi ce hook existe :
// Le SW Workbox met en cache automatiquement les audios APRÈS la 1ère lecture.
// Ce hook permet EN PLUS de les pré-télécharger explicitement (bouton "Hors ligne"),
// et d'afficher l'état de cache sur chaque carte d'exercice.

import { useState, useEffect, useCallback } from 'react';

const AUDIO_CACHE_NAME = 'educalm-audio-cache';

export const useOfflineAudio = (exercicesList) => {
  const [cacheStatus, setCacheStatus] = useState({});
  // ex: { 1: 'cached', 2: 'not_cached', 3: 'downloading', 4: 'no_audio' }

  const isSupported = 'caches' in window;

  // ── Vérifier le statut de cache à chaque chargement de la liste ──────────
  useEffect(() => {
    if (!isSupported || exercicesList.length === 0) return;

    const check = async () => {
      try {
        const cache = await caches.open(AUDIO_CACHE_NAME);
        const newStatus = {};

        for (const exo of exercicesList) {
          if (!exo.audio_url) {
            newStatus[exo.id] = 'no_audio';
            continue;
          }
          // Normalise l'URL : si elle contient localhost:80, on retire le port
          // pour matcher ce que le SW stocke (via le proxy Vite)
          const urlToCheck = exo.audio_url.replace('http://localhost:80', '').replace('http://localhost', '');
          const matched = await cache.match(urlToCheck);
          newStatus[exo.id] = matched ? 'cached' : 'not_cached';
        }

        setCacheStatus(newStatus);
      } catch (err) {
        console.warn('[EduCalm] Vérification cache :', err);
      }
    };

    check();
  }, [exercicesList, isSupported]);

  // ── Mettre en cache UN audio manuellement ────────────────────────────────
  const cacheAudio = useCallback(async (exo) => {
    if (!isSupported || !exo.audio_url) return;

    setCacheStatus((prev) => ({ ...prev, [exo.id]: 'downloading' }));

    try {
      const cache = await caches.open(AUDIO_CACHE_NAME);

      // On utilise le chemin relatif (grâce au proxy, pas besoin de localhost:80)
      // Le proxy Vite transforme /mindfulness_backend/* → http://localhost:80/*
      const relativePath = exo.audio_url.replace(/^https?:\/\/localhost(:\d+)?/, '');

      const response = await fetch(relativePath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await cache.put(relativePath, response.clone());

      setCacheStatus((prev) => ({ ...prev, [exo.id]: 'cached' }));
      console.log(`[EduCalm] ✅ Audio en cache : ${exo.title}`);
    } catch (err) {
      console.error(`[EduCalm] ❌ Erreur cache "${exo.title}" :`, err);
      setCacheStatus((prev) => ({ ...prev, [exo.id]: 'error' }));
    }
  }, [isSupported]);

  // ── Pré-télécharger TOUS les audios non encore en cache ──────────────────
  const cacheAllAudios = useCallback(async () => {
    const toDo = exercicesList.filter(
      (exo) => exo.audio_url && !['cached', 'downloading'].includes(cacheStatus[exo.id])
    );
    for (const exo of toDo) {
      await cacheAudio(exo);
    }
  }, [exercicesList, cacheStatus, cacheAudio]);

  // ── Stats globales ────────────────────────────────────────────────────────
  const cachedCount = Object.values(cacheStatus).filter((s) => s === 'cached').length;
  const totalWithAudio = exercicesList.filter((e) => e.audio_url).length;
  const allCached = totalWithAudio > 0 && cachedCount === totalWithAudio;

  return { cacheStatus, cacheAudio, cacheAllAudios, cachedCount, totalWithAudio, allCached, isSupported };
};