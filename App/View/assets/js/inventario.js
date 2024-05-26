document.addEventListener("DOMContentLoaded", function() {
    const addProductButton = document.getElementById("add-product");
    const inventoryBody = document.getElementById("inventory-body");
    const searchInput = document.getElementById("search");

    // Obtener los productos del almacenamiento local al cargar la página
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Llenar la tabla con los productos guardados
    savedProducts.forEach(product => {
        const newRow = createRow(product);
        inventoryBody.appendChild(newRow);
    });

    addProductButton.addEventListener("click", function() {
        Swal.fire({
            title: 'Agregar Producto',
            html:
                '<input id="nombre" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Nombre">' +
                '<input id="descripcion" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Descripción">' +
                '<input id="precio" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Precio">' +
                '<input id="cantidad" class="swal2-input" style="text-align: center; width: 80%;" placeholder="Cantidad">' +
                '<select id="categoria" class="swal2-select" style="text-align: center; width: 80%;">' +
                    '<option value="" disabled selected>Categoria</option>' +
                    '<option value="Vape">Vape</option>' +
                    '<option value="Calzado">Calzado</option>' +
                '</select>',
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#dc3545', // Rojo
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#28a745', // Verde
            preConfirm: () => {
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

                // Guardar el nuevo producto en el almacenamiento local
                savedProducts.push(product);
                localStorage.setItem("products", JSON.stringify(savedProducts));

                // Crear una nueva fila para la tabla con los datos del producto
                const newRow = createRow(product);

                // Agregar la nueva fila a la tabla
                inventoryBody.appendChild(newRow);

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Producto Agregado',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });

                return true;
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
            <td>${inventoryBody.childElementCount + 1}</td>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.cantidad}</td>
            <td>${product.categoria}</td>
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
