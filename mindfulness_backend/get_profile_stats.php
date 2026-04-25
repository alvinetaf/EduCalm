<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && !empty($data->user_id)) {
    $user_id = $data->user_id;

    try {
        // On récupère les 5 derniers enregistrements, triés du plus récent au plus ancien
        // On formate aussi la date pour qu'elle soit plus jolie en français
        $query = "SELECT score, stress_level, DATE_FORMAT(created_at, '%d/%m/%Y') as date_fr 
                  FROM mood_logs 
                  WHERE user_id = ? 
                  ORDER BY created_at DESC 
                  LIMIT 5";
                  
        $stmt = $pdo->prepare($query);
        $stmt->execute([$user_id]);
        $historique = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "historique" => $historique
        ]);

    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Erreur BDD : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID utilisateur manquant."]);
}
?>