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

    static async handlePromise(adminPromise) {
        try {
            const response = await adminPromise;

            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getConnection() {
        if (!(SecurityService.IsValidString(this._strUsername) && this._blnIsLogged == 1 && SecurityService.IsValidString(this._strUserRole))) {
            throw new Error("Uno de los valores no es permitido")
        }

        if (!SecurityService.IsValidAdministratorUser(new User(this._strUsername, this._strUserRole), this._blnIsLogged)) { throw Error("El usuario no es permitido"); }

        return mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'chanza_db'
        });
    }

    addProduct(product) {
        return new Promise((resolve, reject) => {
            const query = "CALL addNewProduct(?, ?, ?, ?, ?)";

            this.getConnection().query(query, [product.name, product.descrption, product.price, product.category, product.inStock], 
                (error, result) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve({ message: "El producto se ha agregado" });
                    }
            })
        });
    }

    deleteProduct(idProduct) {
        return new Promise((resolve, reject) => {
            const query = "CALL deleteProduct(?)";

            this.getConnection().query(query, [idProduct], (error, result) => {
                if(error){ 
                    reject(error);
                } else {
                    resolve({ message: "El producto se ha eliminado" });
                }
            });
        })
    }

    updateProduct(product) {
        return new Promise((resolve, reject) => {
            const query = "CALL updateProduct(?, ?, ?, ?, ?)";

            this.getConnection().query(query, [product.name, product.descrption, product.price, product.category, product.inStock], 
                (error, result) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve({ message: "El producto se ha actualizado" });
                    }
            })
        });
    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM allProducts";

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

    getBestProducts(startDate, finalDate) {
        return new Promise((resolve, reject) => {
            const query = "CALL getBestProducts(?, ?)";

            this.getConnection().query(query, [startDate, finalDate], (error, result) => {
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

    getWorstProducts(startDate, finalDate) {
        
    }

    getAnnualSalesReport() {

    }

    getRegisteredUsersByMonth() {

    }
}