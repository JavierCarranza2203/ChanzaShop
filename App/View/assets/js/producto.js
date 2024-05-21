import { agregarProductoParaMostrar2 } from "./functions/componentes.js";
import { ObtenerProducto, ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');
const contenedorVapes = document.getElementById('contenedorVapes');

document.addEventListener('DOMContentLoaded', async ()=>{
    let productoVape = await ObtenerProducto('1');

    if(productoVape) {

            agregarProductoParaMostrar2(productoVape.Imagen, productoVape.Nombre, contenedorVapes);
    }
    else {
        
    }
});

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