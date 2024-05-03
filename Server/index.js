// Server principal para recibir las peticiones y "redirigir" a los microservicios
import express from 'express';
import mysql2 from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User } from './Model/UserModel.js';
import { Product } from './Model/ProductModel.js';
import { SecurityService } from './microservices/SecurityService.js';
import { AdminService } from './microservices/AdminService.js';

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
        connection.connect();
        res.status(200).json({
            message: `Servidor corriendo en el puerto: ${port}`,
            connectedToDatabase: connection.authorized,
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
server.get('/login', (req, res) => {
    try {
        const { username, password } = req.query;

        const query = 'SELECT Usuario, Password FROM cliente WHERE Usuario = ?';

        if(SecurityService.IsValidString(username) && SecurityService.IsValidPassword(password)) {
            connection.query(query, [username, password], (err, result) => {
                if(err){
                    console.error('Error al ejecutar la consulta:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }

                if(result == "") { 
                    res.status(401).json({ error: 'El usuario no existe' });
                    return; 
                }

                const data = JSON.parse(JSON.stringify(result[0]));

                if(data["Password"] == password) {
                    const userFound = new User(data["Usuario"], "custom");

                    res.json(userFound.ToJSON());
                }
                else {
                    res.status(401).json({ error: 'La contraseña es incorrecta' });
                }
            });
        }
        else {
            throw Error("El valor no es permitido");
        }
    }
    catch(e) {
        console.error('Error en la aplicación:', e.message);
        res.status(500).json({ error: 'Error interno en el servidor. Por favor, inténtalo de nuevo más tarde.' });
    }
});

//get product by id
server.get("/getProductById", (req, res) => {
    try {
        const query = 'CALL getProductByID(?)';
        const productId = req.query.id;

        if(SecurityService.IsValidNumber(productId)) {
            connection.query(query, [productId] , (err, result) =>{

                if(!result[0][0]) {
                    res.status(404).json({ error: 'El producto no es existe' });
                    return; 
                }

                const data = JSON.parse(JSON.stringify(result[0][0]));

                const product = new Product(data);

                res.json(product.ToJSON());
            });
        }
        else {
            throw Error("El valor no es permitido");
        }
    }
    catch(e) {
        console.error('Error en la aplicación:', e.message);
        res.status(500).json({ error: 'Error interno en el servidor. Por favor, inténtalo de nuevo más tarde.' });
    }
});

//get products by category
server.get("/getProductsByCategory", (req, res) => {
    try {
        const query = 'CALL getProductsByCategory(?)';
        const categoryName = req.query.category;

        if(SecurityService.IsValidString(categoryName)) {
            connection.query(query, [categoryName], (err, result) => {
                if(!result[0][0]) {
                    res.status(404).json({ error: 'La categoría no existe o no hay productos disponibles' });
                    return; 
                }

                const data = result[0];

                const productsList = [];

                for(let i = 0; i < data.length ;i++) {
                    let product = new Product(data[i]);

                    productsList[i] = product.ToJSON();
                }

                res.json(productsList);
            });
        }
        else { 
            throw Error("El valor no es permitido"); 
        }
    }
    catch (e) {
        console.error('Error en la aplicación:', e.message);
        res.status(500).json({ error: 'Error interno en el servidor. Por favor, inténtalo de nuevo más tarde.' });
    }
});

//get top 6 products
server.get("/getBestProductsByCategory", (req, res) => {
    try {
        const query = 'CALL getBestProductsByCategory(?)';
        const category = req.query.category;

        if(SecurityService.IsValidString(category)) {
            connection.query(query, [category], (err, result) => {
                if(!result[0][0]) {
                    res.status(404).json({ error: 'La categoría no existe o no hay productos disponibles' });
                    return; 
                }

                const data = result[0];

                const productsList = [];

                for(let i = 0; i < data.length ;i++) {
                    let product = new Product(data[i]);

                    productsList[i] = product.ToJSON();
                }

                res.json(productsList);
            });
        }
        else {
            throw new Error("El valor no es permitido");
        }
    }
    catch(e) {
        console.error('Error en la aplicación:', e.message);
        res.status(500).json({ error: 'Error interno en el servidor. Por favor ,inténtalo de nuevo más tarde.' })
    }
});

server.post("/adminService", (req, res) => {
    try {
        const username = req.query.username;
        const islogged = req.query.islogged;
        const userrole = req.query.role;

        const adminService = new AdminService();

        adminService.getAllProducts()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            throw new Error(error.message);
        });
    }
    catch(e) {
        console.error('Error en la aplicación:', e.message);
            res.status(500).json({ error: 'Error interno en el servidor. Por favor ,inténtalo de nuevo más tarde.' });
    }
});

//Process exceptions
process.on('unhandledRejection', (error, promise) => {
    console.log('Error en este código: ', promise);
    console.log("==================================");
    console.log('El error fué: ', error );
});