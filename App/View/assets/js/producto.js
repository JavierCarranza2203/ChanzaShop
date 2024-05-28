import { AgregarProductoAlCarrito, ObtenerProducto, ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        const productDetails = await ObtenerProducto(productId);
        if (productDetails) {
            console.log(productDetails);
            mostrarDetallesDelProducto(productDetails);
        } else {
            document.getElementById('product-details').innerHTML = '<p>ID del producto no especificado<p>';
        }
    }
});

function mostrarDetallesDelProducto(product) {
    const productDetailsContainer = document.getElementById('product-details');
    const html = `
    <div class="product-image">
        <img src="img/${product.Imagen}.png" alt="${product.Nombre}">
    </div>
    <div class="details">
        <h1 id="lblNombreProducto">${product.Nombre}</h1>
        <p class="price" id="lblPrecioUnitario">$${product.PrecioUnitario}</p>
        <p>${product.Descripcion}</p>
        <p>Categoría: ${product.Categoria}</p>
        <p>Estado: ${product.Existencia}</p>
        <p>Cantidad: ${product.Cantidad} disponible(s)</p>
        <div class="buttons">
    <div class="icon-text-container">
        <div class="icon-text">
            <i class="fa-solid fa-truck"></i>
            <p>Entrega a domicilio</p>
        </div>
        <div class="icon-text">
            <i class="fa-solid fa-money-bill"></i>
            <p>Pago en efectivo</p>
        </div>
    </div>
    <button class="add-to-cart" id="btnAgregarAlCarrito">Añadir al carrito</button>
</div>
    </div>
    `;
    productDetailsContainer.innerHTML = html;

    document.getElementById("btnAgregarAlCarrito").addEventListener('click', async ()=>{
        try{
            const data = await ObtenerUsuarioLoggeado();

            if(!data){
                alert("Debes de inciar sesión para usar el carrito")
                window.location.href = 'http://localhost/ChanzaShop/App/View/login.html';

            }
            else{
                let producto = {
                    'Numero': product.Numero,
                    'Nombre': product.Nombre,
                    'PrecioUnitario': product.PrecioUnitario,
                    'Cantidad': 1,
                    'Imagen': product.Imagen
                }
        
                let response = await AgregarProductoAlCarrito(JSON.parse(JSON.stringify(producto)));
        
        
                alert(response);
            }
        }catch (error) {
            console.error('Error al obtener el usuario loggeado:', error);
        }
        
    });
}


btnMiPerfil.addEventListener('click', async () => {
    const data = await ObtenerUsuarioLoggeado();
    if (!data) {
        window.location.href = 'login.html';
    } else {
        console.log(data);
        // Aquí puedes añadir más lógica para manejar el perfil del usuario
    }
});
