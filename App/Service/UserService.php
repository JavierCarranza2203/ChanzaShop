<?php

    $url = 'localhost:3000/';
    $userName = $_POST['username'];
    $password = $_POST['password'];
    $action = $_POST['action'];

    $User = [
        'Name' => "Desconocido",
        'Rol' => "Desconocido",
        'IsLogged' => false
    ];

    header('Content-Type: application/json');

    if($action === 'login') {
        try {
            if($userName == "Chanza Admin" && $password == "chanzaAdmin_2024*") {
                $User['Name'] = "Administrador";
                $User['Rol'] = "admin";
                $User['IsLogged'] = true;
            }
            else {
                $url .= "login?username=" . urlencode($userName) . "&password=" . urlencode($password);

                $response = json_decode(file_get_contents($url));

                $User['Name'] = $response['Name'];
                $User['Rol'] = $response['Rol'];
                $User['IsLogged'] = $response['IsLogged'];
            }

            if($User['IsLogged']) {
                $_SESSION[md5('User')] = serialize($User);

                http_response_code(200);
                echo json_encode($User);
            }
            else {
                http_response_code(401);
                echo json_encode("El usuario no se encuentra");
            }
        }
        catch(Exception $e) {
            http_response_code(500);
            echo json_encode($e->getMessage());
        }
    }
    else if('getUser') {
        $loggedUser = unserialize($_SESSION[md5('User')]);

        if($loggedUser['isLogged'] == true) {
            http_response_code(200);
            echo json_encode($loggedUser);
        }
        else {
            http_response_code(401);
            echo json_encode("No ha iniciado sesión");
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