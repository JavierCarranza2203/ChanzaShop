export async function AgregarProductoEnCarrito(container, productName, productImageSrc, productQuantity, productPrice) {
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product-container';

    const img = document.createElement('img');
    img.src = productImageSrc;
    img.alt = productName;

    const productNameH3 = document.createElement('h3');
    productNameH3.id = 'NombreProducto';
    productNameH3.textContent = productName;

    const attributeContainer = document.createElement('div');
    attributeContainer.className = 'product-container__attribute-container';

    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'product-container__attribute';
    quantityDiv.innerHTML = `Cantidad: <i class="fa-solid fa-circle-minus"></i> <b id="contador">${productQuantity}</b> <i class="fa-solid fa-circle-plus"></i>`;

    const priceDiv = document.createElement('div');
    priceDiv.className = 'product-container__attribute';
    priceDiv.innerHTML = `Precio: <b id="lblPrecio">$${productPrice.toFixed(2)}</b>`;

    attributeContainer.appendChild(quantityDiv);
    attributeContainer.appendChild(priceDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'product-container__button';
    deleteButton.id = 'btnNombreProducto';
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i> Eliminar`;

    productDiv.appendChild(img);
    productDiv.appendChild(productNameH3);
    productDiv.appendChild(attributeContainer);
    productDiv.appendChild(deleteButton);

    container.appendChild(productDiv);
}