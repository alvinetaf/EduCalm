<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db_name = "mindfulness_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion BDD."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->pseudo) && !empty($data->password)) {
    
    // On cherche l'élève par son pseudo
    $query = "SELECT id, pseudo, password, classe FROM users WHERE pseudo = :pseudo LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":pseudo", $data->pseudo);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // 🔓 Vérification du mot de passe crypté
        if(password_verify($data->password, $row['password'])) {
            // Tout est bon, on connecte l'élève !
            echo json_encode([
                "success" => true, 
                "message" => "Connexion réussie.",
                "user" => [
                    "id" => $row['id'],
                    "pseudo" => $row['pseudo'],
                    "classe" => $row['classe']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Mot de passe incorrect."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Ce pseudo n'existe pas."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Remplis ton pseudo et ton mot de passe."]);
}
?>