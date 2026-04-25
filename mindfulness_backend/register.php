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

// On vérifie que le pseudo et le mot de passe sont bien remplis
if (!empty($data->pseudo) && !empty($data->password)) {
    
    // 🔒 Cryptage du mot de passe
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

    try {
        // 1. On vérifie si ce pseudo est déjà pris
        $check_query = "SELECT id FROM users WHERE pseudo = :pseudo LIMIT 1";
        $check_stmt = $conn->prepare($check_query);
        $check_stmt->bindParam(":pseudo", $data->pseudo);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Ce pseudo est déjà pris. Choisis-en un autre !"]);
        } else {
            // 2. On insère le nouvel élève avec son âge et sa classe (s'ils sont fournis)
            $query = "INSERT INTO users (pseudo, password, age, classe) VALUES (:pseudo, :password, :age, :classe)";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(":pseudo", $data->pseudo);
            $stmt->bindParam(":password", $hashed_password);
            
            // Gestion de l'âge et de la classe (qui peuvent être vides)
            $age = !empty($data->age) ? $data->age : null;
            $classe = !empty($data->classe) ? $data->classe : null;
            
            $stmt->bindParam(":age", $age);
            $stmt->bindParam(":classe", $classe);
            
            if($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Compte créé avec succès !"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erreur lors de la création."]);
            }
        }
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erreur : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Le pseudo et le mot de passe sont obligatoires."]);
}
?>