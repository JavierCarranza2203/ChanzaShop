// Acciones que solo puede realizar el administrador (Agregar nuevos productos, eliminar, actualizar)
import mysql2 from 'mysql2';
import { Product } from '../Model/ProductModel.js';
import { SecurityService } from './SecurityService.js';
import { User } from '../Model/UserModel.js';

export class AdminService {
    constructor(username, islogged, userrole) {
        this._strUsername = username;
        this._blnIsLogged = islogged;
        this._strUserRole = userrole;
    }

    getConnection() {
        if(!(SecurityService.IsValidString(this._strUsername) && this._blnIsLogged && SecurityService.IsValidString(this._strUserRole))) {
            throw new Error("Uno de los valores no es permitido")
        }

        if(!SecurityService.IsValidAdministratorUser(new User(this._strUsername, this._strUserRole), this._blnIsLogged)) { throw Error("El usuario no es permitido"); }

        return mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'chanza_db'
        });
    }

    //add product
    addProduct(product){
        return new Promise((resolve, reject) => {
            const query = "CALL addProduct(?, ?, ?, ?, ?)";

            this.getConnection().query(query, [product.name])
        });
    }

    //delete product
    deleteProduct(idProduct) { 
        const query = "CALL deleteProduct(?)";
    }

    //update product

    //get all products
    getAllProducts() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM producto";
    
            this.getConnection().query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    const data = result;

                    let productsList = [];
    
                    for (let i = 0; i < data.length; i++) {
                        let product = new Product(data[i]);

                        productsList[i] = product;
                    }

                    resolve(productsList);
                }
            });
        });
    }

    //get best products in a time instance

    //get worst products in a time instance

    //get annual sales report

    //get number of registered users
}