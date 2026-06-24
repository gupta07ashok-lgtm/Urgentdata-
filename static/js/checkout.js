// Checkout
function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    
    let subtotal = 0;
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        const html = `
            <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                <p>${item.name} x ${item.quantity}</p>
                <p style="font-weight: bold;">₹${total}</p>
            </div>
        `;
        orderItems.innerHTML += html;
    });
    
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;
    
    document.getElementById('orderSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('orderShipping').textContent = `₹${shipping}`;
    document.getElementById('orderTax').textContent = `₹${tax}`;
    document.getElementById('orderTotal').textContent = `₹${total}`;
}

const placeOrderBtn = document.getElementById('placeOrderBtn');
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 50;
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + shipping + tax;
        
        try {
            const response = await fetch('/api/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    total: total
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.removeItem('cart');
                window.location.href = `/order-confirmation/${data.order_id}`;
            } else {
                alert(data.message || 'Error placing order');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error placing order. Please try again.');
        }
    });
}

window.addEventListener('load', loadCheckout);
