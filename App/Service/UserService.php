<?php
    require_once("User.php");

    $url = 'localhost:3000/';
    $action = $_POST['action'];

    header('Content-Type: application/json');

    if($action === 'login') {
        try {
            $userName = $_POST['username'];
            $password = $_POST['password'];

            if(empty($userName) || empty($password)) throw new UnexpectedValueException('Ingrese su usuario y contraseña', 401);

            $User = User::Login($userName, $password);

            if($User['estaLoggeado']) {
                $_SESSION[md5('User')] = serialize($User);

                http_response_code(200);
                echo json_encode($User);
            }
        }
        catch(UnexpectedValueException $e)  {
            http_response_code($e->getCode());
            echo json_encode($e->getMessage());
        }
        catch(Exception $e) {
            http_response_code(500);
            echo json_encode("Ocurrió un error no esperado");
        }
    }
    else if($action === 'getUser') {
        try {
            $User = User::Login('as', 'as');
            $_SESSION[md5('User')] = serialize($User);

            if(isset($_SESSION[md5('User')])) {
                $loggedUser = unserialize($_SESSION[md5('User')]);

                if($loggedUser['estaLoggeado'] == true) {
                    http_response_code(200);
                    echo json_encode($loggedUser);
                }
                else {
                    http_response_code(401);
                    echo json_encode("No ha iniciado sesión");
                }
            }
            else {
                http_response_code(404);
                echo json_encode("No hay registro de una sesión válida");
            }
        }
        catch(Exception $e) {
            http_response_code(500);
            echo json_encode("Ocurrió un error no esperado");
        }
    }
    else if('logout') {
        session_start();
        session_destroy();

        http_response_code(200);
        echo json_encode("Se ha cerrado la sesión");
    }
    else {
        http_response_code(403);
        echo json_encode("No se reconoce la operación");
    }

?>