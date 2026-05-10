// vite.config.js — EduCalm (VERSION CORRIGÉE)
// Le proxy est la clé : tous les appels /mindfulness_backend/* passent
// par Vite qui les retransmet à XAMPP. Ainsi le SW voit UNE seule origine.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      includeAssets: ['favicon.ico', 'offline.html'],

      manifest: {
        name: 'EduCalm',
        short_name: 'EduCalm',
        description: 'Pleine conscience et gestion du stress pour élèves camerounais',
        theme_color: '#14532D',
        background_color: '#FFFBEB',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webp,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,

        // Page affichée si l'élève ouvre l'app sans réseau ET sans cache
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/mindfulness_backend/],

        runtimeCaching: [

          // ── Audios MP3 : CacheFirst ─────────────────────────────────────
          // Grâce au proxy, /mindfulness_backend/audio/*.mp3 est VU comme
          // la même origine → le SW peut le cacher normalement (statut 200)
          {
            urlPattern: /\/mindfulness_backend\/.*\.(mp3|ogg|wav|m4a)(\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'educalm-audio-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 jours
              },
              cacheableResponse: { statuses: [200] },
            },
          },

          // ── API PHP : NetworkFirst ──────────────────────────────────────
          {
            urlPattern: /\/mindfulness_backend\/.*\.php(\?.*)?$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'educalm-api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // ── Images : CacheFirst ─────────────────────────────────────────
          {
            urlPattern: /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'educalm-images-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  server: {
    port: 5173,
    proxy: {
      // ✅ Tout /mindfulness_backend/* → redirigé vers XAMPP port 80
      // Le navigateur pense parler à localhost:5173 → même origine → SW fonctionne
      '/mindfulness_backend': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
    proxy: {
      '/mindfulness_backend': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
});
