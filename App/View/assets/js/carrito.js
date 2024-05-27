import { CancelarCompra, ObtenerCarrito, RealizarCompra } from "./functions/peticiones.js";

window.addEventListener('DOMContentLoaded', async () => {
    let contenedorProductos = document.getElementById('pnlOrderContainer');
    let lblTotal = document.getElementById('lblTotal');
    let lblSubTotal = document.getElementById('lblSubTotal');

    ObtenerCarrito(contenedorProductos, lblTotal, lblSubTotal);
});

document.getElementById('btnCancelarCompra').addEventListener('click', async () => {
    const response = await CancelarCompra();

    alert(response);

    location.reload();
});

document.getElementById('btnRealizarCompra').addEventListener('click', async () => {
    const response = await RealizarCompra();

    alert(response);

    location.reload();
});