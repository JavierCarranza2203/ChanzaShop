export class User {
    name;
    role;

    constructor(name, role) {
        this.name = name;
        this.role = role;
    }

    ToJSON() {
        return {
            "Nombre": this.name,
            "Rol": this.role
        };
    }

    static ToUser(json) {
        if (typeof json === 'string') {
            return new User(json["Nombre"], json["Rol"]);
        }
    }
}