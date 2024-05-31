import { AgregarNuevoProducto, ObtenerTodosProducto } from "./functions/peticiones.js";

document.addEventListener("DOMContentLoaded", async function() {
    const addProductButton = document.getElementById("add-product");
    const inventoryBody = document.getElementById("inventory-body");
    const searchInput = document.getElementById("search");

    const response = await ObtenerTodosProducto()
    let data = response;
    for(let key in data){
        inventoryBody.appendChild(createRow(data[key]));
    }

    const deleteButtons = document.querySelectorAll('.delete-product');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productNumber = button.closest('tr').querySelector('td:first-child').textContent;
            fetch(`http://localhost:3000/deleteProduct?id=${productNumber}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }

                Swal.fire({
                    title: 'Producto Eliminado',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejar el error si es necesario
            });
        });
    });


    addProductButton.addEventListener("click", async function() {
        Swal.fire({
            title: 'Agregar Producto',
            html:
                '<input id="nombre" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Nombre">' +
                '<input id="descripcion" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Descripción">' +
                '<input id="precio" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Precio">' +
                '<input id="cantidad" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Cantidad">' +
                '<select id="categoria" class="swal2-select" style="text-align: center; width: 80%;">' +
                    '<option value="" disabled selected>Categoria</option>' +
                    '<option value="vapes">Vapes</option>' +
                    '<option value="calzado">Calzado</option>' +
                '</select>',
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#dc3545', // Rojo
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#28a745', // Verde
            preConfirm: async () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const descripcion = Swal.getPopup().querySelector('#descripcion').value;
                const precio = Swal.getPopup().querySelector('#precio').value;
                const cantidad = Swal.getPopup().querySelector('#cantidad').value;
                const categoria = Swal.getPopup().querySelector('#categoria').value;

                if (!nombre || !descripcion || !precio || !cantidad || !categoria) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                const product = {
                    nombre,
                    descripcion,
                    precio,
                    cantidad,
                    categoria
                };

                await AgregarNuevoProducto(product);
            }
        });
    });

    // Evento para eliminar un producto
    inventoryBody.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-product")) {
            const rowToDelete = event.target.parentElement.parentElement;
            const index = Array.from(inventoryBody.children).indexOf(rowToDelete);

            // Eliminar el producto del arreglo y del almacenamiento local
            savedProducts.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(savedProducts));

            rowToDelete.remove();
        }
    });

    // Función para crear una fila de la tabla
    function createRow(product) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${product.Numero}</td>
            <td>${product.Nombre}</td>
            <td>${product.Descripcion}</td>
            <td>${product.PrecioUnitario}</td>
            <td>${product.Categoria}</td>
            <td><button class="delete-product">Eliminar</button></td>
        `;

        return newRow;
    }

    // Evento para buscar productos mientras escribes
    searchInput.addEventListener("input", function() {
        const searchText = searchInput.value.trim().toLowerCase();
        const rows = inventoryBody.querySelectorAll("tr");

        rows.forEach(row => {
            const id = row.querySelector("td:first-child").textContent.trim().toLowerCase();
            const name = row.querySelector("td:nth-child(2)").textContent.trim().toLowerCase();
            const description = row.querySelector("td:nth-child(3)").textContent.trim().toLowerCase();

            if (id.includes(searchText) || name.includes(searchText) || description.includes(searchText)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
