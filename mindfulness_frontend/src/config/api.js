// src/config/api.js — EduCalm
// Point unique pour toutes les URLs de l'API.
// En développement (npm run dev) → proxy Vite → /mindfulness_backend
// En production (Vercel)         → VITE_API_URL défini dans les variables d'env Vercel

const BASE = import.meta.env.VITE_API_URL || '/mindfulness_backend';

export const API = {
  GET_EXERCISES:   `${BASE}/get_exercises.php`,
  EVALUATE_STRESS: `${BASE}/evaluate_stress.php`,
  GET_PROFIL_STAT: `${BASE}/get_profil_stat.php`,
  LOGIN:           `${BASE}/login.php`,
  REGISTER:        `${BASE}/register.php`,
};