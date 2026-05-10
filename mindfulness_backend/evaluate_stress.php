<?php
// evaluate_stress.php — EduCalm (VERSION CORRIGÉE)
// La recommandation d'exercice est maintenant basée sur le niveau de stress réel,
// pas sur ORDER BY RAND() aveugle.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->reponses) || !isset($data->user_id)) {
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit;
}

$reponses  = $data->reponses;
$user_id   = $data->user_id;

// ── 1. Calcul du score ────────────────────────────────────────────────────────
// 4 questions × max 3 points = 12 points au total
$scoreTotal = array_sum($reponses);

// ── 2. Détermination du niveau ────────────────────────────────────────────────
// Basé sur les seuils de Cohen (PSS) et Lovibond (DASS) adaptés à 4 questions
//   0–4  → Niveau 1 (Faible)
//   5–8  → Niveau 2 (Modéré)
//   9–12 → Niveau 3 (Élevé)
$niveauStress = 1;
if ($scoreTotal >= 5 && $scoreTotal <= 8) {
    $niveauStress = 2;
} elseif ($scoreTotal >= 9) {
    $niveauStress = 3;
}

try {
    // ── 3. Sauvegarde dans mood_logs ──────────────────────────────────────────
    if (!empty($user_id)) {
        $stmtLog = $pdo->prepare(
            "INSERT INTO mood_logs (user_id, score, stress_level) VALUES (?, ?, ?)"
        );
        $stmtLog->execute([$user_id, $scoreTotal, $niveauStress]);
    }

    // ── 4. Conseil ciblé selon le niveau ─────────────────────────────────────
    $stmtTip = $pdo->prepare(
        "SELECT content FROM tips WHERE stress_level = ? ORDER BY RAND() LIMIT 1"
    );
    $stmtTip->execute([$niveauStress]);
    $tip = $stmtTip->fetch(PDO::FETCH_ASSOC);

    // Conseils de fallback si la table tips est vide pour ce niveau
    $conseilsParDefaut = [
        1 => "Bien joué ! Ton niveau de stress est faible. Continue avec une courte séance d'Attention Focalisée pour rester dans cet état.",
        2 => "Ton stress est modéré. Une séance de Respiration Consciente ou de Marche va t'aider à retrouver ton calme.",
        3 => "Ton niveau de stress est élevé. Prends un moment pour toi avec une Méditation Guidée — tu en as besoin et tu le mérites.",
    ];

    $conseil = $tip
        ? $tip['content']
        : $conseilsParDefaut[$niveauStress];

    // ── 5. Exercice recommandé selon le niveau ────────────────────────────────
    // CORRECTION CLÉ : on cible les exercices dont stress_level = niveau détecté.
    // Si aucun n'est trouvé pour ce niveau exact, on prend le plus proche.
    $stmtExo = $pdo->prepare(
        "SELECT * FROM exercises WHERE stress_level = ? ORDER BY RAND() LIMIT 1"
    );
    $stmtExo->execute([$niveauStress]);
    $exercice = $stmtExo->fetch(PDO::FETCH_ASSOC);

    // Fallback : si pas d'exercice pour ce niveau exact, on prend n'importe lequel
    if (!$exercice) {
        $stmtFallback = $pdo->query(
            "SELECT * FROM exercises ORDER BY ABS(stress_level - $niveauStress) LIMIT 1"
        );
        $exercice = $stmtFallback->fetch(PDO::FETCH_ASSOC);
    }

    // ── 6. Libellé lisible du niveau ──────────────────────────────────────────
    $libelles = [
        1 => "Faible",
        2 => "Modéré",
        3 => "Élevé",
    ];

    // ── 7. Réponse JSON enrichie ──────────────────────────────────────────────
    echo json_encode([
        "success" => true,
        "score"   => $scoreTotal,
        "niveau"  => $niveauStress,
        "niveau_libelle" => $libelles[$niveauStress],
        "recommandation" => [
            "conseil"  => $conseil,
            "exercice" => $exercice,
        ],
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage(),
    ]);
}
?>