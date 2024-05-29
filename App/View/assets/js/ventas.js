import { ObtenerVentas } from "./functions/peticiones.js";

document.addEventListener("DOMContentLoaded", async function() {
    const addProductButton = document.getElementById("add-product");
    const inventoryBody = document.getElementById("inventory-body");
    const searchInput = document.getElementById("search");

    const response = await ObtenerVentas()
    let data = response;
    console.log(data);
    for(let key in data){
        inventoryBody.appendChild(createRow(data[key]));
    }

    // Obtener los productos del almacenamiento local al cargar la página
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Llenar la tabla con los productos guardados
    savedProducts.forEach(product => {
        const newRow = createRow(product);
        inventoryBody.appendChild(newRow);
    });

    

    // Función para crear una fila de la tabla
    function createRow(product) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${product.NombreCliente}</td>
            <td>${product.IdVenta}</td>
            <td>${product.NombreProducto}</td>
            <td>${product.CantidadPendiente}</td>
        `;

        return newRow;
    }

    // Evento para buscar productos mientras escribes
    searchInput.addEventListener("input", function() {
        const searchText = searchInput.value.trim().toLowerCase();
        const rows = inventoryBody.querySelectorAll("tr");

        rows.forEach(row => {
            const cliente = row.querySelector("td:first-child").textContent.trim().toLowerCase();
            const venta = row.querySelector("td:nth-child(2)").textContent.trim().toLowerCase();
            const producto = row.querySelector("td:nth-child(3)").textContent.trim().toLowerCase();

            if (cliente.includes(searchText) || venta.includes(searchText) || producto.includes(searchText)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
