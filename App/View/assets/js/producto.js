import { agregarProductoParaMostrar2 } from "./functions/componentes.js";
import { ObtenerProducto, ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');
const contenedorVapes = document.getElementById('contenedorVapes');


document.addEventListener('DOMContentLoaded', async ()=>{
    const urlParams=new URLSearchParams(window.location.search);
    const productId=urlParams.get('id');
    if(productId) {
        const productDetails= await ObtenerProducto(productId);
        if(productDetails){
            console.log(productDetails);
            mostrarDetallesDetallesDelProducto(productDetails);
        }
        else{
            document.getElementById('product-details').innerHTML='<p>ID del producto no especificado<p>';
        }
    }
    else {
        
    }
});

function mostrarDetallesDetallesDelProducto(product){
    const productDetailsContainer=document.getElementById('product-details');
    const html= `
    <h1>${product.Nombre}</h1>
    <img src="img/${product.Imagen}.png" alt="${product.Nombre}">
    <div>
        <p>${product.Descripcion}</p>
        <p>Precio: $${product.PrecioUnitario}</p>
        <p>Categoría: ${product.Categoria}</p>
        <p>Estado: ${product.Existencia}</p>
        <p>Cantidad: ${product.Cantidad} disponible(s)</p>
    </div>
`
    productDetailsContainer.innerHTML=html;
}





































btnMiPerfil.addEventListener('click', async () => {
    const data = await ObtenerUsuarioLoggeado();
    console.log(data)

    if(!data) {
        window.location.href = 'http://localhost/ChanzaShop/App/View/login.html';
    }
    else {
        console.log(data)
        // const mainDiv = document.createElement('div');

        // const boldText = document.createElement('b');
        // boldText.textContent = 'Nombre de usuario: ';

        // const button = document.createElement('button');
        // button.textContent = 'Cerrar sesión';

        // mainDiv.appendChild(boldText);
        // mainDiv.appendChild(button);

        // // Añadir el contenedor principal al body del documento
        // document.body.appendChild(mainDiv);
    }
});