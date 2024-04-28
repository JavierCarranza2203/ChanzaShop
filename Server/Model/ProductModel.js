export class Product {
    id;
    name;
    description;
    price;
    category;
    inStock;

    constructor(data) {
        this.id = data["IdProducto"];
        this.name = data["Nombre"];
        this.description = data["Descripcion"];
        this.price = data["Precio"];
        this.category = data["Categoria"];
        this.inStock = data["enStock"];
    }

    ToJSON() {
        return {
            "Numero": this.id,
            "Nombre": this.name,
            "Descripcion": this.description,
            "PrecioUnitario": this.price,
            "Categoria": this.category,
            "Existencia": this.inStock
        }
    }
}