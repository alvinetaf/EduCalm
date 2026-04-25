<?php
// Paramètres de connexion à la base de données
$host = "localhost";
$dbname = "mindfulness_db";
$username = "root"; // L'utilisateur par défaut de XAMPP
$password = "";     // Pas de mot de passe par défaut sur XAMPP

// Options pour gérer les erreurs et le format des données
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    // Création de la connexion
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, $options);
// echo "Connexion réussie à la base de données mindfulness_db ! 🎉";
} catch (PDOException $e) {
    // Si la connexion échoue, on affiche l'erreur
    echo "Erreur de connexion : " . $e->getMessage();
}
?>