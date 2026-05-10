<?php
// get_profil_stat.php — EduCalm (VERSION ENRICHIE)
// Retourne l'historique + les statistiques complètes pour la page Profil

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || empty($data->user_id)) {
    echo json_encode(["success" => false, "message" => "ID utilisateur manquant."]);
    exit;
}

$user_id = $data->user_id;

try {
    // ── 1. Historique des 10 derniers bilans ─────────────────────────────────
    $stmtHisto = $pdo->prepare("
        SELECT
            score,
            stress_level,
            DATE_FORMAT(created_at, '%d/%m/%Y') AS date_fr,
            DATE_FORMAT(created_at, '%Y-%m-%d') AS date_iso
        FROM mood_logs
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $stmtHisto->execute([$user_id]);
    $historique = $stmtHisto->fetchAll(PDO::FETCH_ASSOC);

    // ── 2. Statistiques globales ─────────────────────────────────────────────
    $stmtStats = $pdo->prepare("
        SELECT
            COUNT(*)                    AS total_bilans,
            ROUND(AVG(score), 1)        AS score_moyen,
            MIN(score)                  AS score_min,
            MAX(score)                  AS score_max,
            ROUND(AVG(stress_level), 1) AS niveau_moyen
        FROM mood_logs
        WHERE user_id = ?
    ");
    $stmtStats->execute([$user_id]);
    $stats = $stmtStats->fetch(PDO::FETCH_ASSOC);

    // ── 3. Tendance : compare les 3 derniers vs les 3 précédents ────────────
    // Si score moyen récent < score moyen ancien → amélioration (stress baisse)
    $stmtRecent = $pdo->prepare("
        SELECT ROUND(AVG(score), 1) AS moy
        FROM (SELECT score FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 3) AS t
    ");
    $stmtRecent->execute([$user_id]);
    $moyRecent = $stmtRecent->fetch(PDO::FETCH_ASSOC)['moy'];

    $stmtAncien = $pdo->prepare("
        SELECT ROUND(AVG(score), 1) AS moy
        FROM (SELECT score FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 6) AS t
    ");
    $stmtAncien->execute([$user_id]);
    $moyAncien = $stmtAncien->fetch(PDO::FETCH_ASSOC)['moy'];

    // tendance : 'amelioration' | 'stable' | 'degradation'
    $tendance = 'stable';
    if ($moyRecent !== null && $moyAncien !== null) {
        $diff = $moyRecent - $moyAncien;
        if ($diff <= -1)      $tendance = 'amelioration';
        elseif ($diff >= 1)   $tendance = 'degradation';
    }

    // ── 4. Badge de progression selon le comportement ────────────────────────
    $totalBilans = (int)$stats['total_bilans'];
    $badge = 'Apprenti(e) Jedi de la détente'; // défaut
    if ($totalBilans >= 3  && $tendance === 'amelioration') $badge = 'En progrès 🌱';
    if ($totalBilans >= 5)                                  $badge = 'Pratiquant(e) régulier(e) 🧘';
    if ($totalBilans >= 10 && $tendance === 'amelioration') $badge = 'Maître(sse) du calme 🏆';
    if ($totalBilans >= 10 && $tendance === 'stable')       $badge = 'Gardien(ne) de la sérénité ✨';

    // ── 5. Données pour le graphique (ordre chronologique pour la courbe) ───
    $stmtGraph = $pdo->prepare("
        SELECT
            score,
            stress_level,
            DATE_FORMAT(created_at, '%d/%m') AS label
        FROM mood_logs
        WHERE user_id = ?
        ORDER BY created_at ASC
        LIMIT 10
    ");
    $stmtGraph->execute([$user_id]);
    $graphData = $stmtGraph->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success"    => true,
        "historique" => $historique,
        "stats"      => [
            "total_bilans"  => $totalBilans,
            "score_moyen"   => (float)$stats['score_moyen'],
            "score_min"     => (int)$stats['score_min'],
            "score_max"     => (int)$stats['score_max'],
            "niveau_moyen"  => (float)$stats['niveau_moyen'],
            "tendance"      => $tendance,
            "badge"         => $badge,
        ],
        "graphData"  => $graphData,
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erreur BDD : " . $e->getMessage()]);
}
?>