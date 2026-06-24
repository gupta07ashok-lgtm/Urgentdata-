// Cart Page
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const html = `
            <div class="cart-item">
                <div style="flex: 1;">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>₹${item.price} each</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold;">₹${total}</p>
                    <button onclick="removeCartItem(${index})" class="btn btn-outline btn-sm">Remove</button>
                </div>
            </div>
        `;
        cartItems.innerHTML += html;
    });
    
    updateCartSummary(subtotal);
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateCartSummary(subtotal) {
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('tax').textContent = `₹${tax}`;
    document.getElementById('total').textContent = `₹${total}`;
}

const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        window.location.href = '/checkout';
    });
}

window.addEventListener('load', loadCart);
