import { AgregarProductoEnCarrito } from "./componentes.js";

const server = 'http://localhost'

export async function ObtenerUsuarioLoggeado() {
    const data = new FormData();
    data.append('action', 'getUser');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
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
    const response = await fetch(server + ':3000/getBestProductsByCategory?category=' + category);

    if (response.ok) {
        const productos = await response.json();
        return productos;
    } else {
        return false;
    }
}

export async function ObtenerProductos(category) {
    const response = await fetch(server + ':3000/getProductsByCategory?category=' + category);

    if (response.ok) {
        const productos = await response.json();
        return productos;
    } else {
        return false;
    }
}

export async function ObtenerProducto(id) {
    const response = await fetch(server + ':3000/getProductById?id=' + id);

    if (response.ok) {
        const producto = await response.json();
        return producto;
    } else {
        return false;
    }
}

export async function ObtenerTodosProducto() {
    const response = await fetch(server + ':3000/getAllProducts', {
        method:"POST"
    });
    if (response.ok) {
        const producto = await response.json();
        console.log(producto)
        return producto;
        
    } else {
        return false;
    }
}

export async function AgregarProductoAlCarrito(producto) {
    const data = new FormData();
    data.append('action', 'shop');
    data.append('producto', JSON.stringify(producto));
    data.append('shopAction', 'add');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: data
    });

    if(response.ok) {
        const data = await response.json();

        return data;
    }
    else {
        const data = await response.json();
        return data;
    }
}

export async function ObtenerCarrito(contenedorProductos, lblTotal, lblSubTotal) {
    const data = new FormData();
    data.append('action', 'shop');
    data.append('shopAction', 'get');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: data
    });

    if(response.ok) {
        const data = await response.json();
        let SubTotal = 0;
        let Total = 0;
        
        for(let key in data) {
            let producto = data[key];
            AgregarProductoEnCarrito(contenedorProductos, producto.Nombre, producto.Imagen, producto.Cantidad, producto.PrecioUnitario, server, producto);
            SubTotal += producto.PrecioUnitario * producto.Cantidad;
        }

        Total = SubTotal + 100;

        lblTotal.textContent = '$' + Total + '.00';
        lblSubTotal.textContent = '$' + SubTotal + '.00';
    }
    else {
        return data;
    }
}

export async function CancelarCompra() {
    const data = new FormData();

    data.append('action', 'shop');
    data.append('shopAction', 'cancel');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: data
    });

    if(response.ok) {
        const data = await response.json();

        return data;
    }
    else {
        const data = await response.json();
        return data;
    }
}

export async function RealizarCompra() {
    const data = new FormData();

    data.append('action', 'shop');
    data.append('shopAction', 'buy');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: data
    });

    if(response.ok) {
        const data = await response.json();
        console.log(data);
        return data['message'];
    }
    else {
        const data = await response.json();
        return data['error'];
    }
}

export async function CerrarSesion() {
    const data = new FormData();
    data.append('action', 'logout');

    const response = await fetch(server + '/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: data
    });

    if (response.ok) {
        // Si la respuesta es exitosa, recarga la página
        window.location.reload();
    } else {
        // Manejar el caso en que ocurra un error al cerrar la sesión
        console.error('Error al cerrar sesión:', response.statusText);
    }
}






export async function ObtenerUsuariosRegistrados() {
    const response = await fetch(server + ':3000/getRegisteredUsersData');
    console.log(response);
    if (response.ok) {
        const productos = await response.json();
        return productos;
    } else {
        return false;
    }
}