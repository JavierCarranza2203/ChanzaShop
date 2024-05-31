<?php
    class User 
    {
        public $userName;
        public $estaLoggeado;
        public $tipoUsuario;
        public Array $carrito;

        public function __construct($userName, $estaLoggeado, $tipoUsuario, $carrito) {
            $this->userName = $userName;
            $this->estaLoggeado = $estaLoggeado;
            $this->tipoUsuario = $tipoUsuario;
            $this->carrito = $carrito;
        }

        public static function Login(string $userName, string $password) {
            // $User = self::UserToJson("Desconocido", "Desconocido", false);

            if($userName === "Chanza Admin") {
                if($password === "1234")
                {
                    $User = self::UserToJson("Administrador", "admin", true, []);
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
                    $User = self::UserToJson($decodedResponse['Nombre'], $decodedResponse['Rol'], true, []);
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

        public function HandleShopAction($action, $product) {
            try {
                $message = '';

                switch($action) {
                    case "add":
                            $message =  $this->AddProductToBuy($product);
                        break;
                    case "delete":
                            $message = $this->DeleteProductToBuy($product);
                        break;
                    case "buy":
                            $message = $this->BuyShoppingCart();
                        break;
                    case "cancel":
                            $message = $this->CancelShoppingCart();
                        break;
                    case "get":
                            $message = $this->GetShoppingCart();
                        break;
                    case "update":
                            $message = $this->UpdateShoppingCart($product);
                        break;
                    default:
                        throw new Exception("Acción no válida");
                }

                return $message;
            }
            catch(Exception $e) {
                throw new Exception("Hubo un error: " . $e->getMessage());
            }
        }

        private function AddProductToBuy($product) {
            $product = json_decode($product, true);

            if(count($this->carrito) <= 0) { $this->carrito[$product['Numero']] = $product; }
            else if(isset($this->carrito[$product['Numero']])) { throw new Exception('El producto ya está en el carrito'); }
            else { $this->carrito[$product['Numero']] = $product; }

            return "El producto se ha agregado al carrito de compras";
        }

        private function DeleteProductToBuy($product) {
            $product = json_decode($product, true);

            if(isset($this->carrito[$product['Numero']])) {
                unset($this->carrito[$product['Numero']]);

                return "El producto se ha eliminado";
            }
            else {
                throw new Exception('El producto no está en el carrito');
            }
        }

        public function BuyShoppingCart() {
            $url = 'http://localhost:3000/buyOrder';

            // Datos a enviar en el cuerpo de la solicitud
            $data = [
                'order' => $this->carrito,
                'userName' => $this->userName
            ];
        
            // Inicializar cURL
            $ch = curl_init($url);
        
            // Configurar opciones de cURL
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        
            // Ejecutar la solicitud
            $response = curl_exec($ch);
        
            // Verificar si hubo errores
            if ($response === false) {
                $error = curl_error($ch);
                curl_close($ch);
                throw new Exception('Error en la solicitud cURL: ' . $error);
            }
        
            // Cerrar cURL
            curl_close($ch);
        
            // Decodificar la respuesta JSON
            $responseData = json_decode($response, true);
        
            // Verificar si la respuesta contiene un error
            if (isset($responseData['error'])) {
                throw new Exception('Error en la respuesta del servidor: ' . $responseData['error']);
            }
            
            $this->CancelShoppingCart();

            return $responseData;
        }

        private function CancelShoppingCart() {
            $this->carrito = [];

            return "El carrito se ha borrado";
        }

        private function GetShoppingCart() {
            return $this->carrito;
        }

        private function UpdateShoppingCart($product) {
            $product = json_decode($product, true);

            if(isset($this->carrito[$product['Numero']])) {
                $this->carrito[$product['Numero']] = $product;
            }
            else {
                throw new Exception('El producto no está en el carrito');
            }
        }

        public static function UserToJson(string $name, string $role, bool $isLogged, $carrito) {
            return [
                'Nombre' => $name,
                'estaLoggeado' => $isLogged,
                'TipoUsuario' => $role,
                'Carrito' => $carrito
            ];
        } 
    }
?>