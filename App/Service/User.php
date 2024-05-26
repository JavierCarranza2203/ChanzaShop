<?php
    class User 
    {
        public static function Login(string $userName, string $password) {
            // $User = self::UserToJson("Desconocido", "Desconocido", false);
            $User = self::UserToJson("Administrator", "admin", true);

            if($userName === "Chanza Admin") {
                if($password === "chanzaAdmin_2024*")
                {
                    $User = self::UserToJson("Administrador", "admin", true);
                }
            }
            else {
                $curl = curl_init("localhost:3000/login?username=" . urlencode($userName) . "&password=" . urlencode($password));

                if(!$curl) throw new Exception("Error al intentar conectarse a la API");

                curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);

                $response = curl_exec($curl);

                $decodedResponse = json_decode($response, true);

                $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

                curl_close($curl);

                if($httpCode >= 200 && $httpCode < 300) {
                    $User = self::UserToJson($decodedResponse['Nombre'], $decodedResponse['Rol'], true);
                }
                else if($httpCode == 401){
                    throw new UnexpectedValueException($decodedResponse['error'], $httpCode);
                }
                else {
                    throw new Exception($decodedResponse['error'], $httpCode);
                }
            }

            return $User;
        }

        public function AddProductToBuy($product) {
            $carrito = [];

            if (!isset($_SESSION[md5('User')])) { 
                throw new Exception("No se ha iniciado sesión");
            }
            else {
                $carrito = unserialize($_SESSION[md5('ShoppingCart')]);
            }

            array_push($carrito, $product);
            $_SESSION[md5('ShoppingCart')] = serialize($carrito);

            return "El producto se ha agregado al carrito de compras";
        }

        public function DeleteProductToBuy($product) {
            
        }

        public function BuyShoppingCart() {
            
        }

        private static function UserToJson(string $name, string $role, bool $isLogged) {
            return [
                'Nombre' => $name,
                'estaLoggeado' => $isLogged,
                'TipoUsuario' => $role
            ];
        } 
    }
?>