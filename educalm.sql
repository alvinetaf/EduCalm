-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 25 avr. 2026 à 05:03
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mindfulness_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `exercises`
--

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `duration` varchar(20) NOT NULL,
  `audio_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `exercises`
--

INSERT INTO `exercises` (`id`, `title`, `description`, `duration`, `audio_url`) VALUES
(1, 'Respiration Consciente', 'Technique simple pour réguler rapidement le stress et l’anxiété avant un cours.', '3 min', 'http://localhost/mindfulness_backend/audios/respiration.mp3'),
(2, 'Méditation Guidée', 'Laisse-toi guider étape par étape pour focaliser ton attention et retrouver ton calme.', '5 min', 'http://localhost/mindfulness_backend/audios/meditation.mp3'),
(3, 'Le Body Scan', 'Balayage corporel progressif pour identifier et relâcher les tensions physiques.', '8 min', 'http://localhost/mindfulness_backend/audios/bodyscan.mp3'),
(4, 'Marche Consciente', 'Idéal sur le chemin de l\'école. Mobilise ton attention sur les sensations du mouvement.', '4 min', 'http://localhost/mindfulness_backend/audios/marche.mp3'),
(5, 'Attention Focalisée', 'Travail sur l’ancrage mental et la réduction de la dispersion cognitive pour mieux réviser.', '10 min', 'http://localhost/mindfulness_backend/audios/attention.mp3');

-- --------------------------------------------------------

--
-- Structure de la table `mood_logs`
--

CREATE TABLE `mood_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `stress_level` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `mood_logs`
--

INSERT INTO `mood_logs` (`id`, `user_id`, `score`, `stress_level`, `note`, `created_at`) VALUES
(1, 1, 1, 0, 'J\'ai réussi à connecter React et PHP', '2026-03-09 12:53:18'),
(2, 1, 1, 0, 'J\'ai réussi à connecter React et PHP', '2026-03-09 12:53:25'),
(3, 1, 1, 0, 'J\'ai réussi à connecter React \n', '2026-03-09 12:53:37'),
(4, 1, 4, 0, 'J\'ai réussi \n\n', '2026-03-09 12:57:45'),
(5, 1, 1, 0, '', '2026-04-08 14:58:02'),
(6, 1, 1, 0, '', '2026-04-08 15:32:01'),
(7, 2, 4, 1, NULL, '2026-04-14 07:49:25'),
(8, 2, 8, 2, NULL, '2026-04-14 08:07:19'),
(9, 2, 4, 1, NULL, '2026-04-20 12:15:28'),
(10, 2, 4, 1, NULL, '2026-04-20 12:18:19'),
(11, 2, 6, 2, NULL, '2026-04-22 14:39:58'),
(12, 2, 8, 2, NULL, '2026-04-23 12:45:44');

-- --------------------------------------------------------

--
-- Structure de la table `tips`
--

CREATE TABLE `tips` (
  `id` int(11) NOT NULL,
  `stress_level` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tips`
--

INSERT INTO `tips` (`id`, `stress_level`, `content`, `created_at`) VALUES
(1, 1, 'Super ! Tu gères bien. Maintiens cette belle énergie avec un petit exercice de gratitude ce soir.', '2026-04-14 05:54:41'),
(2, 1, 'Tout semble aller pour le mieux ! Profites-en pour avancer sur tes révisions dans le calme.', '2026-04-14 05:54:41'),
(3, 2, 'On sent une légère tension. Lève-toi, étire tes épaules, et bois un grand verre d\'eau avant de reprendre.', '2026-04-14 05:54:41'),
(4, 2, 'La fatigue scolaire s\'installe. Fais une pause de 5 minutes avec un exercice de cohérence cardiaque.', '2026-04-14 05:54:41'),
(5, 3, 'Alerte rouge ! Ton cerveau a besoin d\'une pause immédiate. Lance un exercice de respiration profonde.', '2026-04-14 05:54:41'),
(6, 3, 'La pression est trop forte en ce moment. Ne force pas. Écoute un audio de relaxation corporelle avant de faire tes devoirs.', '2026-04-14 05:54:41');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `classe` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `pseudo`, `password`, `age`, `classe`, `created_at`) VALUES
(1, 'EleveTest', 'motdepasse123', NULL, NULL, '2026-03-09 12:53:18'),
(2, 'alvine', '$2y$10$O3sXag7gq3OKgyseEfdApuShSoeGGJbCHDF3w2yQ82tf/S7fUmBJK', 17, 'Terminale', '2026-03-16 14:12:15');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pseudo` (`pseudo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `tips`
--
ALTER TABLE `tips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `mood_logs`
--
ALTER TABLE `mood_logs`
  ADD CONSTRAINT `mood_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
