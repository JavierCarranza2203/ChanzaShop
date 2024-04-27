// Server principal para recibir las peticiones y "redirigir" a los microservicios
import express from 'express';
import mysql2 from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User } from './Model/UserModel.js';

const server = express();
const port = 3000;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chanza_db'
});

//Start server
server.listen(port, (req, res) => {
    console.log("Servidor corriendo en el puerto: " + port);
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
server.get('/login', (req, res)=>{
    const { username, password } = req.query;

    const query = 'SELECT Usuario, Password FROM cliente WHERE Usuario = ?';

    if(username && password){
        connection.query(query, [username, password], (err, response) => {
            if(err){
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }

            if(response == "") { 
                res.status(401).json({ error: 'El usuario no existe' });
                return; 
            }

            const data = JSON.parse(JSON.stringify(response[0]));

            if(data["Password"] == password) {
                const userFound = new User(data["Usuario"], "custom");

                res.json(userFound.ToJSON());
            }
            else {
                res.status(401).json({ error: 'La contraseña es incorrecta' });
            }
        });
    }
});

//get product by id

//get products by category

//get top 6 products


//Process exceptions
process.on('unhandledRejection', (error, promise) => {
    console.log('Error en este código: ', promise);
    console.log("==================================");
    console.log('El error fué: ', error );
});