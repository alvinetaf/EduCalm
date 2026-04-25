# EduCalm - Application de Mindfulness et de Gestion du Stress Scolaire 🧘🏾‍♂️📚

Ce projet est développé dans le cadre d'un mémoire de fin d'études (Niveau 5) en filière informatique à l'École Normale Supérieure (ENS) de Yaoundé. 

## 🎯 Contexte et Objectifs
Au Cameroun, la pression académique, l'environnement scolaire et la peur de décevoir l'entourage génèrent un stress important chez les élèves du secondaire. D'après notre enquête terrain (126 répondants) :
- **80%** des élèves ont peur de décevoir leurs parents.
- **50%** sont limités par le coût de la connexion Internet.
- **77%** souhaitent une application numérique d'aide à la gestion du stress.

L'objectif de cette application est d'offrir un soutien psychologique accessible, basé sur des techniques de pleine conscience (mindfulness), tout en s'adaptant aux réalités technologiques locales (fracture numérique).

## 🚀 Fonctionnalités Principales
* **Mode Hors-Ligne (PWA) :** Utilisation possible sans connexion Internet constante pour s'adapter au contexte local.
* **Séances de Méditation Courtes :** Lecteur audio intégré pour des exercices de respiration et de pleine conscience (1 à 5 minutes).
* **Espace de Motivation :** Affichage de conseils quotidiens et de messages d'encouragement ("Tips").
* **Suivi de l'Humeur :** Journalisation de l'état émotionnel de l'élève pour l'aider à sortir du "pilotage automatique".

## 🛠️ Pile Technologique (Stack)
Ce projet adopte une architecture découplée (Client/Serveur) :
* **Frontend :** React JS avec Vite (Interface fluide, orientée mobile, mode sombre intégré).
* **Backend :** PHP natif (API REST pour la gestion des données).
* **Base de données :** MySQL.
* **Environnement local :** XAMPP & Node.js.

## 📁 Architecture du Projet
- `/frontend/` : Contient le code source de l'application React.
- `/backend/` : Contient les scripts PHP et les requêtes SQL (API).
- `/database/` : Contient les scripts de création des tables SQL.

---
*Conçu et développé pour améliorer le bien-être des élèves du secondaire au Cameroun.*