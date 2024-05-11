export class User {
    id;
    name;
    lastname;
    surname;
    role;
    email;
    phone;
    user;

    constructor(id, name, role, email, phone, user, lastname, surname) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.user = user;
        this.lastname = lastname;
        this.surname = lastname
    }

    ToJSON() {
        return {
            "Id": this.id,
            "Nombre": this.name,
            "Rol": this.role,
            "Correo": this.email,
            "Telefono": this.phone,
            "Usuario": this.user,
            "ApellidoP": this.lastname,
            "ApellidoM": this.surname
        };
    }

    static ToUser(json) {
        if (typeof json === 'string') {
            return new User(json["Id"], json["Nombre"], json["Rol"], 
                json["Correo"], json["Telefono"], json["Usuario"],
                json["ApellidoP"], json["ApellidoM"]);
        }
    }
}