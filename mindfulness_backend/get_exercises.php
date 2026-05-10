<?php
// get_exercises.php — EduCalm PRODUCTION READY
// Ajout : support CORS pour Vercel + gestion OPTIONS preflight

$allowed_origins = [
    'http://localhost:5173',        // dev local
    'http://localhost:4173',        // preview local
    'https://educalm.vercel.app',   // ← remplace par ton URL Vercel exacte
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // En développement ou si origine inconnue, on autorise quand même
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

try {
    $sql  = "SELECT * FROM exercises ORDER BY stress_level ASC";
    $stmt = $pdo->query($sql);
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $exercises]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
}
?>