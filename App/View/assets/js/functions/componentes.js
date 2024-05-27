export async function AgregarProductoEnCarrito(container, productName, productImageSrc, productQuantity, productPrice, rutaServer, product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-container';

    const img = document.createElement('img');
    img.src = rutaServer + '/ChanzaShop/App/View/img/' + productImageSrc + '.png';
    img.alt = productName;

    const productNameH3 = document.createElement('h3');
    productNameH3.id = 'NombreProducto';
    productNameH3.textContent = productName;

    const attributeContainer = document.createElement('div');
    attributeContainer.className = 'product-container__attribute-container';

    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'product-container__attribute';

    // Crear elementos para cada parte del contenido
    const cantidadTexto = document.createElement('span');
    cantidadTexto.textContent = 'Cantidad: ';

    const menosIcono = document.createElement('i');
    menosIcono.className = 'fa-solid fa-circle-minus';
    menosIcono.id = 'btnMenos';

    const contador = document.createElement('b');
    contador.id = 'contador';
    contador.textContent = ' ' + productQuantity + ' ';

    const masIcono = document.createElement('i');
    masIcono.className = 'fa-solid fa-circle-plus';
    masIcono.id = 'btnMas';

    quantityDiv.appendChild(cantidadTexto);
    quantityDiv.appendChild(menosIcono);
    quantityDiv.appendChild(contador);
    quantityDiv.appendChild(masIcono);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'product-container__attribute';
    priceDiv.innerHTML = `Precio: <b id="lblPrecio">$${productPrice}</b>`;

    attributeContainer.appendChild(quantityDiv);
    attributeContainer.appendChild(priceDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'product-container__button';
    deleteButton.id = 'btnEliminarProducto';
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i> Eliminar`;

    deleteButton.addEventListener('click', async () => {
        const data = new FormData();
        data.append('action', 'shop');
        data.append('shopAction', 'delete');
        data.append('producto', JSON.stringify(product));

        const response = await fetch(rutaServer + '/ChanzaShop/App/Service/UserService.php', {
            method: 'POST',
            body: data
        });

        if(response.ok) {
            alert('El producto se ha eliminado');
        }
        else {
            alert('Error al eliminar el producto');
        }

        location.reload();
    });

    masIcono.addEventListener('click', async() => {
        product.Cantidad += 1;
        console.log(product)
        const data = new FormData();
        data.append('action', 'shop');
        data.append('shopAction', 'update');
        data.append('producto', JSON.stringify(product));

        const response = await fetch(rutaServer + '/ChanzaShop/App/Service/UserService.php', {
            method: 'POST',
            body: data
        });

        location.reload();
    });

    menosIcono.addEventListener('click', async ()=> {
        if(productQuantity === 1) { alert('La cantidad no puede ser menor a 1'); }
        else {
            product.Cantidad -= 1;
            const data = new FormData();
            data.append('action', 'shop');
            data.append('shopAction', 'update');
            data.append('producto', JSON.stringify(product));

            const response = await fetch(rutaServer + '/ChanzaShop/App/Service/UserService.php', {
                method: 'POST',
                body: data
            });
        }

        location.reload();
    });

    productDiv.appendChild(img);
    productDiv.appendChild(productNameH3);
    productDiv.appendChild(attributeContainer);
    productDiv.appendChild(deleteButton);

    container.appendChild(productDiv);
}

export async function agregarProductoParaMostrar(imgSrc, id, container) {
    const contenedorProducto = document.createElement('div');
    contenedorProducto.classList.add('products-container__row-item');
    const link = document.createElement('a');

    link.href=`View/producto.html?id=${id}`;

    const imgElement = document.createElement('img');
    imgElement.src = './View/img/' + imgSrc + '.png'

    link.appendChild(imgElement);

    contenedorProducto.appendChild(link);

    container.appendChild(contenedorProducto);
}

export async function agregarProductoParaMostrar2(imgSrc, id, container) {
    const contenedorProducto = document.createElement('div');
    contenedorProducto.classList.add('products-container__row-item');
    const link = document.createElement('a');

    link.href=`producto.html?id=${id}`;

    const imgElement = document.createElement('img');
    imgElement.src = 'img/' + imgSrc + '.png'

    link.appendChild(imgElement);

    contenedorProducto.appendChild(link);

    container.appendChild(contenedorProducto);
}