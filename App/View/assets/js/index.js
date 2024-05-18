import { agregarProductoParaMostrar } from "./functions/componentes.js";
import { ObtenerMejoresProductos } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');
const contenedorCalzado = document.getElementById('contenedorCalzado');
const contenedorVapes = document.getElementById('contenedorVapes');

document.addEventListener('DOMContentLoaded', async ()=>{
    let listaProductosCalzado = await ObtenerMejoresProductos('calzado');
    let listaProductosVape = await ObtenerMejoresProductos('vapes');

    if(listaProductosCalzado) {
        listaProductosCalzado.forEach(producto => {
            console.log(producto)
            agregarProductoParaMostrar(producto.Imagen, producto.Nombre, contenedorCalzado)
        });

        listaProductosVape.forEach(vape => {
            agregarProductoParaMostrar(vape.Imagen, vape.Nombre, contenedorVapes);
        });
    }
    else {
        
    }
});

btnMiPerfil.addEventListener('click', async () => {
    const data = await ObtenerUsuarioLoggeado();

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