const servicesGrid = document.getElementById('servicesGrid');
const welcomeText = document.getElementById('welcomeText');
const logoutBtn = document.getElementById('logoutBtn');

// Add dashboard class to body
document.body.classList.add('dashboard');

// Load services
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        
        servicesGrid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <h3>${service.name}</h3>
                <div class="price">
                    <span class="price-in">₹${service.price_in}</span>
                    <span class="price-int">$${service.price_int}</span>
                </div>
            `;
            servicesGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading services:', error);
        welcomeText.textContent = 'Error loading services. Please refresh the page.';
    }
}

// Logout
logoutBtn.addEventListener('click', () => {
    // Clear session and redirect to home
    window.location.href = '/';
});

// Load services on page load
loadServices();
