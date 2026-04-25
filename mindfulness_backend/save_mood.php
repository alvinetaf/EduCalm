<?php
// 1. Les laissez-passer (CORS) pour autoriser React à nous parler
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Si React envoie une requête de vérification "OPTIONS" (Preflight), on dit "OK" et on arrête là.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. On importe notre fichier de connexion à la base de données
require_once 'db.php';

// 3. On récupère le paquet de données envoyé par React et on le traduit de JSON vers PHP
$data = json_decode(file_get_contents("php://input"));

// 4. On vérifie que React a bien envoyé un score d'humeur
if (isset($data->mood_score)) {
    try {
        // Pour nos tests, on simule que l'élève connecté porte l'ID numéro 1
        $user_id = 1; 

        // ASTUCE : On crée un utilisateur factice "EleveTest" s'il n'existe pas encore.
        // Cela évite que MySQL refuse l'insertion à cause de notre clé étrangère (FOREIGN KEY).
        $pdo->exec("INSERT IGNORE INTO users (id, pseudo, password) VALUES (1, 'EleveTest', 'motdepasse123')");

        // 5. On prépare la requête SQL sécurisée
        $sql = "INSERT INTO mood_logs (user_id, mood_score, note) VALUES (:user_id, :mood_score, :note)";
        $stmt = $pdo->prepare($sql);
        
        // 6. On exécute la requête en injectant les vraies données
        $stmt->execute([
            ':user_id' => $user_id,
            ':mood_score' => $data->mood_score,
            ':note' => isset($data->note) ? $data->note : null
        ]);

        // 7. On renvoie un accusé de réception positif à React !
        echo json_encode(["success" => true, "message" => "Humeur enregistrée avec succès dans la base de données !"]);

    } catch (PDOException $e) {
        // En cas de problème avec la base de données
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    // Si React a oublié d'envoyer le score
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Données incomplètes, aucun score reçu."]);
}
?>