<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "chanza_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["error" => "Invalid JSON data"]);
        exit();
    }

    if (isset($data['name'], $data['description'], $data['price'], $data['category'])) {
        $name = $data['name'];
        $description = $data['description'];
        $price = $data['price'];
        $category = $data['category'];

        $stmt = $conn->prepare("CALL addNewProduct(?, ?, ?, ?)");
        if (!$stmt) {
            echo json_encode(["error" => "Prepare failed: " . $conn->error]);
            exit();
        }

        $stmt->bind_param("ssds", $name, $description, $price, $category);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Producto agregado exitosamente"]);
        } else {
            echo json_encode(["error" => "Error al agregar el producto: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Datos incompletos"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
