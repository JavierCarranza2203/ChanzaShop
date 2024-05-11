import { SecurityService } from "./SecurityService.js";
import { Order } from "../Model/OrderModel.js";

export class Customer {
    createAccount(user, connection) {
        return new Promise((resolve, reject) => {
            if(!SecurityService.IsValidUser(user)) { reject("Hay un error, por favor verifique sus datos"); }

            const query = "CALL signUp(?, ?, ?, ?, ?, ?, ?)";

            connection.query(query, [user.name, user.lastname, user.surname, user.email, user.phone, user.user, user.password],
                (error, results) => {
                    if(error) { 
                        reject(error); 
                    } else{
                        resolve({ mensaje: "¡La cuenta se ha creado!" });
                    }
                });
        });
    }

    changePassword(newPassword, oldPassword, idUser) {
        return new Promise((resolve, reject) => {
            if(!(SecurityService.IsValidNumber(idUser) && SecurityService.IsValidPassword(newPassword) && SecurityService.IsValidPassword(oldPassword))) { reject("¡Hay un error, por favor verifique sus datos!"); }

            const query = "CALL signUp(?, ?, ?, ?, ?, ?, ?)";

            connection.query(query, [user.name, user.lastname, user.surname, user.email, user.phone, user.user, user.password],
                (error, results) => {
                    if(error) { 
                        reject(error); 
                    } else{
                        resolve({ mensaje: "¡La cuenta se ha creado!" });
                    }
                });
        });
    }

    buyOrder(orderId) {
        
    }

    saveShoppingCar(order) {
        
    }

    getOrderById() {

    }

    getAllOrders() {

    }

    
}