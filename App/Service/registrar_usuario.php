<?php
// Inicia la sesión
session_start();

// Conexión a la base de datos
$conexion = new mysqli("localhost", "root", "", "chanza_db");

// Verificación de la conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Inicializa la variable de mensaje
$mensaje = "";

// Verifica si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtención de los datos del formulario y validación
    $nombre = validarEntrada($_POST['nombre']);
    $apellido_paterno = validarEntrada($_POST['apellido_paterno']);
    $apellido_materno = validarEntrada($_POST['apellido_materno']);
    $email = validarEntrada($_POST['email']);
    $telefono = validarEntrada($_POST['telefono']);
    $usuario = validarEntrada($_POST['usuario']);
    $contrasena = validarEntrada($_POST['contrasena']);

    // Hash de la contraseña
    $hashed_password = password_hash($contrasena, PASSWORD_DEFAULT);

    // Consulta SQL preparada para insertar los datos en la tabla cliente
    $sql = "INSERT INTO cliente (Nombre, ApellidoPaterno, ApellidoMaterno, Email, Telefono, Usuario, Password) VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Preparar la consulta
    if ($stmt = $conexion->prepare($sql)) {
        // Vincular los parámetros y ejecutar la consulta
        $stmt->bind_param("sssssss", $nombre, $apellido_paterno, $apellido_materno, $email, $telefono, $usuario, $hashed_password);
        if ($stmt->execute()) {
            // Redireccionar a la página de registro exitoso
            header("Location: ../View/registro_exitoso.html"); // Ruta ajustada aquí
            exit(); // Asegura que el script se detenga después de redireccionar
        } else {
            $mensaje = "Error al registrar el usuario: " . $stmt->error;
        }
        // Cerrar la declaración
        $stmt->close();
    } else {
        $mensaje = "Error al preparar la consulta: " . $conexion->error;
    }
}

// Cerrar la conexión
$conexion->close();

// Función para validar la entrada
function validarEntrada($dato) {
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato);
    return $dato;
}
?>
