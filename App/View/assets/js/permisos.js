import { ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

window.addEventListener('load', async() =>{
    const data = await ObtenerUsuarioLoggeado();
    if(data['TipoUsuario'] !== 'admin') {
        let iconos = document.querySelectorAll('.btn');

        iconos.forEach(icon => {
            icon.classList.add('content-blocker--hidden')
        })
    }
    else {
        const icon = document.getElementsByClassName('btn1');

        icon[0].classList.add('content-blocker--hidden');
    }
});