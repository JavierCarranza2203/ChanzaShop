<?php
try {
require_once("User.php");

// Inicia la sesión si no está iniciada
session_start();

// Define la URL base, aunque actualmente no se está utilizando
$url = 'localhost:3000/';

// Verifica si se ha enviado un parámetro 'action'
if (isset($_POST['action'])) {
    // Obtiene la acción del formulario
    $action = $_POST['action'];

    // Establece el tipo de contenido de la respuesta como JSON
    header('Content-Type: application/json');

    // Maneja la acción 'login'
    if ($action === 'login') {
        try {
            // Obtiene el nombre de usuario y la contraseña del formulario
            $userName = $_POST['username'];
            $password = $_POST['password'];

            // Verifica si el nombre de usuario y la contraseña están vacíos
            if (empty($userName) || empty($password)) {
                throw new UnexpectedValueException('Ingrese su usuario y contraseña', 401);
            }

            // Llama al método de autenticación del usuario
            $User = User::Login($userName, $password);

            // Verifica si el usuario está autenticado correctamente
            if ($User['estaLoggeado']) {
                // Guarda el usuario autenticado en la sesión
                $_SESSION[md5('User')] = serialize($User);

                // Devuelve una respuesta JSON exitosa
                http_response_code(200);
                echo json_encode($User);
            }
        } catch (UnexpectedValueException $e) {
            // Maneja excepciones de valor inesperado
            http_response_code($e->getCode());
            echo json_encode($e->getMessage());
        } catch (Exception $e) {
            // Maneja excepciones generales
            http_response_code(500);
            echo json_encode("Ocurrió un error no esperado");
        }
    } elseif ($action === 'getUser') {
        // Maneja la acción 'getUser'
        try {
            // Verifica si hay una sesión válida
            if (isset($_SESSION[md5('User')])) {
                // Obtiene el usuario de la sesión
                $loggedUser = unserialize($_SESSION[md5('User')]);

                // Verifica si el usuario está autenticado
                if ($loggedUser['estaLoggeado'] == true) {
                    // Devuelve el usuario autenticado como JSON
                    http_response_code(200);
                    echo json_encode($loggedUser);
                } else {
                    // Devuelve un error si el usuario no está autenticado
                    http_response_code(401);
                    echo json_encode("No ha iniciado sesión");
                }
            } else {
                // Devuelve un error si no hay una sesión válida
                http_response_code(404);
                echo json_encode("No hay registro de una sesión válida");
            }
        } catch (Exception $e) {
            // Maneja excepciones generales
            http_response_code(500);
            echo json_encode("Ocurrió un error no esperado");
        }
    } elseif ($action === 'logout') {
        // Maneja la acción 'logout'
        // Destruye la sesión
        session_destroy();
    
        // Devuelve una respuesta JSON exitosa
        http_response_code(200);
        echo json_encode("Se ha cerrado la sesión");
    }
    else if($action === 'shop') {
        $producto = $_POST['producto'] ?? null;
        $shopAction = $_POST['shopAction'];

        $loggedUser = unserialize($_SESSION[md5('User')]);
        $user = new User($loggedUser['Nombre'], $loggedUser['estaLoggeado'], $loggedUser['TipoUsuario'], $loggedUser['Carrito']);
        
        $message = $user->HandleShopAction($shopAction, $producto);

        $_SESSION[md5('User')] = serialize(User::UserToJson($user->userName, $user->tipoUsuario, $user->estaLoggeado, $user->carrito));

        echo json_encode($message);
    }
    else {
        // Devuelve un error si la acción no es reconocida
        http_response_code(403);
        echo json_encode("No se reconoce la operación");
    }
} else {
    // Devuelve un error si no se proporciona una acción
    http_response_code(400);
    echo json_encode("Se requiere una acción");
}
}
catch(Exception $e) {
    http_response_code(500);
    echo json_encode($e->getMessage());
}
?>
