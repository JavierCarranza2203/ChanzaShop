export class Product {
    id;
    name;
    description;
    price;
    category;
    inStock;
    quantity;
    img;

    constructor(data) {
        console.log(data)
        this.id = data["IdProducto"];
        this.name = data["Nombre"];
        this.description = data["Descripcion"];
        this.price = data["Precio"];
        this.category = data["Categoria"];
        this.inStock = data["enStock"];
        this.quantity = data["Cantidad"];
        this.img = data["nombreImg"];
    }

    ToJSON() {
        return {
            "Numero": this.id,
            "Nombre": this.name,
            "Descripcion": this.description,
            "PrecioUnitario": this.price,
            "Categoria": this.category,
            "Existencia": this.inStock,
            "Cantidad":this.quantity,
            "Imagen": this.img
        }
    }

    static ToProduct(json) {
        return new Product(json["Numero"], json["Nombre"], json["Descripcion"], json["Precio"], json["Categoria"],
            json["enStock"], json["Cantidad"]);
    }
}