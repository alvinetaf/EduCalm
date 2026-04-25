<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->reponses) && isset($data->user_id)) {
    
    // 1. On prépare les données reçues
    $reponses = $data->reponses;
    $user_id = $data->user_id; // On récupère l'ID envoyé par React
    
    // 2. Calcul du score (0 à 12)
    $scoreTotal = array_sum($reponses);
    
    // 3. Déduction du niveau selon les échelles de Cohen/Lovibond
    $niveauStress = 1; 
    if ($scoreTotal >= 5 && $scoreTotal <= 8) {
        $niveauStress = 2;
    } elseif ($scoreTotal >= 9) {
        $niveauStress = 3;
    }

    try {
        // --- C'EST ICI QU'IL FAUT METTRE L'INSERTION ---
        
        // On vérifie que l'user_id n'est pas vide pour éviter une erreur SQL
        if (!empty($user_id)) {
            $stmtLog = $pdo->prepare("INSERT INTO mood_logs (user_id, score, stress_level) VALUES (?, ?, ?)");
            $stmtLog->execute([$user_id, $scoreTotal, $niveauStress]);
        }

        // ----------------------------------------------

        // Ensuite, on continue avec la récupération du conseil et de l'exercice
        $stmtTip = $pdo->prepare("SELECT content FROM tips WHERE stress_level = ? ORDER BY RAND() LIMIT 1");
        $stmtTip->execute([$niveauStress]);
        $tip = $stmtTip->fetch(PDO::FETCH_ASSOC);

        $stmtExo = $pdo->prepare("SELECT * FROM exercises ORDER BY RAND() LIMIT 1");
        $stmtExo->execute();
        $exercice = $stmtExo->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "score" => $scoreTotal,
            "niveau" => $niveauStress,
            "recommandation" => [
                "conseil" => $tip ? $tip['content'] : "Prends une grande respiration.",
                "exercice" => $exercice
            ]
        ]);

    } catch (Exception $e) {
        // Très important pour le débug : cela affichera l'erreur SQL si l'insertion échoue
        echo json_encode(["success" => false, "message" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID utilisateur ou réponses manquantes."]);
}
?>