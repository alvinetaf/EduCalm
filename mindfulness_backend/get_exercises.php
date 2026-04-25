<?php
// 1. Les laissez-passer (CORS) habituels
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Connexion à la base de données
require_once 'db.php';

try {
    // 3. On demande TOUS les exercices de la table
    $sql = "SELECT * FROM exercises";
    $stmt = $pdo->query($sql);
    
    // On récupère tout sous forme de tableau
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. On envoie le tableau à React
    echo json_encode([
        "success" => true,
        "data" => $exercises
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
}
?>

