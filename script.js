const apiUrl = 'https://fakestoreapi.com/products';
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let products = [];

console.log(cart[1]);

async function getProducts() {
    const response = await fetch(apiUrl);
    products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-4', 'mb-4');

        productDiv.innerHTML = `
            <div class="card p-3">
                <img src="${product.image}" class="card-img-top" height="150">
                <div class="card-body">
                    <h5>${product.title}</h5>
                    <p>$${product.price}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <span class="mx-2" id="qty-${product.id}">${cart[product.id] || 0}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm mt-2" onclick="removeFromCart(${product.id})">Remove</button>
                </div>
            </div>
        `;

        productsContainer.appendChild(productDiv);
    });

    updateCartSummary();
}

function changeQuantity(productId, change) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    cart[productId] = Math.max(0, cart[productId] + change);

    if (cart[productId] === 0) {
        delete cart[productId];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById(`qty-${productId}`).innerText = cart[productId] || 0;
    updateCartSummary();
}

function removeFromCart(productId) {
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    getProducts();  
}

function updateCartSummary() {
    let totalPrice = 0;
    let totalItems = 0;

   
    Object.keys(cart).forEach(id => {
        totalItems += cart[id];

        const product = products.find(p => p.id === parseInt(id));
        if (product) {
            totalPrice += cart[id] * product.price;
        }
    });

    document.getElementById('total-price').innerText = totalPrice.toFixed(2);
    
    if (totalItems === 0)
     {
         document.getElementById('shipping').innerText = 0;
     }
     else
     {
         document.getElementById('shipping').innerText = totalItems > 4 ? '10.00' : '7.00';
     }

}

getProducts();
