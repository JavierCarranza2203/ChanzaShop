// Server principal para recibir las peticiones y "redirigir" a los microservicios
import { express } from 'express';
import { mysql2 } from 'mysql2';

const server = new express();
const port = 3000;

server.use(cors());

//Start server
server.listen(port, (req, res) => {
    console.log("Servidor corriendo en el puerto: " + port);
});

//Process exceptions
process.on('unhandledRejection', (error, promise) => {
    console.log('Error en este código: ', promise);
    console.log("==================================");
    console.log('El error fué: ', error );
});

//Test server connection
server.get('/test_connection', (req, res) => {
    try {
        res.status(200).json({
            message: `Servidor corriendo en el puerto: ${port}`,
            connectedToDatabase: true,
        });
    }
    catch(error) {
        res.status(500).json({
            message: `Algo está mal!`,
            connectedToDatabase: false,
        });
    }
});

//get user credentials

//get product by id

//get products by category

//get top 6 products