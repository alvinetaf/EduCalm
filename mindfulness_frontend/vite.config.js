import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Met à jour l'appli automatiquement en arrière-plan
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Fichiers de base
      manifest: {
        name: 'EduCalm - Pleine Conscience',
        short_name: 'EduCalm',
        description: 'Ton espace de sérénité au quotidien pour réduire le stress.',
        theme_color: '#14532D', // La couleur de la barre en haut du téléphone (Vert Forêt)
        background_color: '#FAFAF9', // La couleur de l'écran de chargement (Beige doux)
        display: 'standalone', // Cache la barre du navigateur web pour faire "vraie" appli
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
