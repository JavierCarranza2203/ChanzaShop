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
}