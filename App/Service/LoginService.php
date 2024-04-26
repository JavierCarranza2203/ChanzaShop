<?php

    $url = 'localhost:3000/';
    $userName = $_GET['username'];
    $password = $_GET['password'];
    $isLogin = $_GET['isLogin'];

    if($isLogin) {
        $url .= "login?username=" . urlencode($userName) . "&password=" . urlencode($password);

        $respone = file_get_contents($url);

        echo json_decode($respone);
    }
    else {
        session_start();
        session_destroy();
    }

?>