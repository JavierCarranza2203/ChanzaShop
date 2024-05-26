export async function ObtenerUsuarioLoggeado() {
    const data = new FormData();
    data.append('action', 'getUser');

    const response = await fetch("./Service/UserService.php", {
        method: "POST",
        body: data
    });

    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        return false;
    }
}

export async function ObtenerMejoresProductos(category) {
    const response = await fetch('http://localhost:3000/getBestProductsByCategory?category=' + category);

    if (response.ok) {
        const productos = await response.json();
        return productos;
    } else {
        return false;
    }
}

export async function ObtenerProductos(category) {
    const response = await fetch('http://localhost:3000/getProductsByCategory?category=' + category);

    if (response.ok) {
        const productos = await response.json();
        return productos;
    } else {
        return false;
    }
}

export async function ObtenerProducto(id) {
    const response = await fetch('http://localhost:3000/getProductById?id=' + id);

    if (response.ok) {
        const producto = await response.json();
        return producto;
    } else {
        return false;
    }
}



