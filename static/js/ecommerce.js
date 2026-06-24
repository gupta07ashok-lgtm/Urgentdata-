// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = cart.length;
}

// Add to Cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = e.target.dataset.productId;
        addToCart(productId);
    }
});

function addToCart(productId) {
    // Get product name from the card
    const productCard = event.target.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const priceText = productCard.querySelector('.current-price').textContent;
    const price = parseInt(priceText.replace('₹', ''));
    
    const item = {
        id: productId,
        name: productName,
        price: price,
        quantity: 1
    };
    
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert('Added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Wishlist Management
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-wishlist')) {
        const productId = e.target.dataset.productId;
        addToWishlist(productId);
    }
});

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistUI();
        alert('Added to wishlist!');
    }
}

// User Menu
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');

if (userMenuBtn) {
    userMenuBtn.addEventListener('click', function() {
        this.parentElement.classList.toggle('active');
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        fetch('/api/logout', { method: 'POST' })
            .then(() => window.location.href = '/')
            .catch(console.error);
    });
}

// Initialize
window.addEventListener('load', function() {
    updateCartUI();
    updateWishlistUI();
});
