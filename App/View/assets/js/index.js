import { ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');

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