import { agregarProductoParaMostrar } from "./functions/componentes.js";
import { ObtenerMejoresProductos, ObtenerUsuarioLoggeado } from "./functions/peticiones.js";

const btnMiPerfil = document.getElementById('btnMiPerfil');
const contenedorCalzado = document.getElementById('contenedorCalzado');
const contenedorVapes = document.getElementById('contenedorVapes');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const listaProductosCalzado = await ObtenerMejoresProductos('calzado');
        const listaProductosVape = await ObtenerMejoresProductos('vapes');

        if (listaProductosCalzado && listaProductosVape) {
            listaProductosCalzado.forEach(producto => {
                agregarProductoParaMostrar(producto.Imagen, producto.Imagen, contenedorCalzado);
            });

            listaProductosVape.forEach(vape => {
                agregarProductoParaMostrar(vape.Imagen, vape.Imagen, contenedorVapes);
            });
        } else {
            console.error('No se pudo obtener la lista de productos.');
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});

// Definición de la función CerrarSesion
function CerrarSesion() {
    // Creamos un nuevo objeto FormData
    const formData = new FormData();
    // Agregamos la acción de logout al FormData
    formData.append('action', 'logout');

    // Enviamos la solicitud POST al servidor
    fetch('http://localhost/ChanzaShop/App/Service/UserService.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Redirige al usuario a la página de inicio de sesión
            window.location.href = 'http://localhost/ChanzaShop/App/View/login.html';
        } else {
            console.error('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
    });
}



btnMiPerfil.addEventListener('click', async () => {
    try {
        const data = await ObtenerUsuarioLoggeado();

        if (!data) {
            window.location.href = 'http://localhost/ChanzaShop/App/View/login.html';
        } else {
            // Bloquear el desplazamiento del cuerpo
            document.body.classList.add('modal-open');

            // Mostrar el modal para cerrar sesión
            const result = await Swal.fire({
                title: 'Sesión Activa',
                icon: 'success',
                showCloseButton: false,
                html: `
                    <p>Hola, ${data.Nombre}</p>
                `,
                focusConfirm: false,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745', // Verde
                showCancelButton: true,
                cancelButtonText: 'Cerrar Sesión',
                cancelButtonColor: '#dc3545', // Rojo
                preConfirm: () => {
                    // Lógica para manejar la confirmación del usuario
                    // Si deseas realizar alguna acción al hacer clic en "Aceptar", puedes hacerlo aquí
                }
            });

            // Cuando se cierra el modal, quitar la clase que bloquea el desplazamiento
            document.body.classList.remove('modal-open');
            
            // Si el usuario hizo clic en el botón "Cerrar sesión"
            if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
                // Llamar a la función para cerrar sesión y recargar la página
                CerrarSesion();
            }
        }
    } catch (error) {
        console.error('Error al obtener el usuario loggeado:', error);
    }
});

