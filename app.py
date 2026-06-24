from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import random
import string
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'urgentdata-ecommerce-secret-key')

# In-memory storage
otp_storage = {}
user_data = {}
orders = []
wishlist = {}

# Mock Products Data
PRODUCTS = [
    {'id': 1, 'name': 'Smart Phone X1', 'price': 24999, 'original_price': 35999, 'category': 'Electronics', 'image': '/static/images/phone.jpg', 'rating': 4.5, 'reviews': 1234, 'stock': 45, 'description': 'Latest smartphone with 5G support'},
    {'id': 2, 'name': 'Wireless Headphones', 'price': 2999, 'original_price': 5999, 'category': 'Electronics', 'image': '/static/images/headphones.jpg', 'rating': 4.3, 'reviews': 567, 'stock': 120, 'description': 'Premium sound quality headphones'},
    {'id': 3, 'name': 'Laptop Pro', 'price': 79999, 'original_price': 99999, 'category': 'Electronics', 'image': '/static/images/laptop.jpg', 'rating': 4.7, 'reviews': 890, 'stock': 30, 'description': '15-inch HD laptop with 16GB RAM'},
    {'id': 4, 'name': 'Casual T-Shirt', 'price': 399, 'original_price': 999, 'category': 'Fashion', 'image': '/static/images/tshirt.jpg', 'rating': 4.2, 'reviews': 456, 'stock': 200, 'description': 'Cotton casual t-shirt in multiple colors'},
    {'id': 5, 'name': 'Running Shoes', 'price': 2499, 'original_price': 4999, 'category': 'Fashion', 'image': '/static/images/shoes.jpg', 'rating': 4.4, 'reviews': 789, 'stock': 85, 'description': 'Comfortable running shoes with cushioning'},
    {'id': 6, 'name': 'Smart Watch', 'price': 5999, 'original_price': 9999, 'category': 'Electronics', 'image': '/static/images/watch.jpg', 'rating': 4.6, 'reviews': 654, 'stock': 60, 'description': 'Fitness tracking smart watch'},
    {'id': 7, 'name': 'Portable Charger', 'price': 1299, 'original_price': 2499, 'category': 'Electronics', 'image': '/static/images/charger.jpg', 'rating': 4.3, 'reviews': 432, 'stock': 150, 'description': '20000mAh portable power bank'},
    {'id': 8, 'name': 'Winter Jacket', 'price': 1999, 'original_price': 4999, 'category': 'Fashion', 'image': '/static/images/jacket.jpg', 'rating': 4.5, 'reviews': 567, 'stock': 70, 'description': 'Warm and stylish winter jacket'},
]

CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books']

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def generate_order_id():
    return 'ORD' + ''.join(random.choices(string.digits, k=8))

# Routes
@app.route('/')
def home():
    deals = [p for p in PRODUCTS[:4]]
    return render_template('ecommerce/home.html', products=deals)

@app.route('/products')
def products():
    category = request.args.get('category', '')
    search = request.args.get('search', '')
    
    filtered = PRODUCTS
    if category:
        filtered = [p for p in filtered if p['category'] == category]
    if search:
        filtered = [p for p in filtered if search.lower() in p['name'].lower()]
    
    return render_template('ecommerce/products.html', products=filtered, categories=CATEGORIES, selected_category=category)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return redirect(url_for('products'))
    similar = [p for p in PRODUCTS if p['category'] == product['category'] and p['id'] != product_id][:4]
    return render_template('ecommerce/product_detail.html', product=product, similar=similar)

@app.route('/cart')
def cart():
    return render_template('ecommerce/cart.html')

@app.route('/checkout')
def checkout():
    if 'mobile' not in session or not session.get('verified'):
        return redirect(url_for('login'))
    return render_template('ecommerce/checkout.html')

@app.route('/order-confirmation/<order_id>')
def order_confirmation(order_id):
    return render_template('ecommerce/order_confirmation.html', order_id=order_id)

@app.route('/track-order/<order_id>')
def track_order(order_id):
    order = next((o for o in orders if o['order_id'] == order_id), None)
    if not order:
        return redirect(url_for('home'))
    return render_template('ecommerce/track_order.html', order=order)

@app.route('/my-orders')
def my_orders():
    if 'mobile' not in session or not session.get('verified'):
        return redirect(url_for('login'))
    user_orders = [o for o in orders if o['mobile'] == session.get('mobile')]
    return render_template('ecommerce/my_orders.html', orders=user_orders)

@app.route('/dashboard')
def dashboard():
    if 'mobile' not in session or not session.get('verified'):
        return redirect(url_for('login'))
    user_orders = [o for o in orders if o['mobile'] == session.get('mobile')]
    user_wishlist = wishlist.get(session.get('mobile'), [])
    return render_template('ecommerce/dashboard.html', orders=user_orders, wishlist_count=len(user_wishlist), total_spent=sum([o['total'] for o in user_orders]))

@app.route('/wishlist')
def view_wishlist():
    if 'mobile' not in session or not session.get('verified'):
        return redirect(url_for('login'))
    user_wishlist_ids = wishlist.get(session.get('mobile'), [])
    user_wishlist = [p for p in PRODUCTS if p['id'] in user_wishlist_ids]
    return render_template('ecommerce/wishlist.html', wishlist=user_wishlist)

@app.route('/contact')
def contact():
    return render_template('ecommerce/contact.html')

@app.route('/about')
def about():
    return render_template('ecommerce/about.html')

@app.route('/login')
def login():
    return render_template('ecommerce/login.html')

@app.route('/faq')
def faq():
    faqs = [
        {'question': 'How do I place an order?', 'answer': 'Browse products, add to cart, and proceed to checkout.'},
        {'question': 'What is the delivery time?', 'answer': 'Standard delivery is 3-5 business days.'},
        {'question': 'What is your return policy?', 'answer': 'We offer 7-day returns on most products.'},
    ]
    return render_template('ecommerce/faq.html', faqs=faqs)

# API Endpoints
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    mobile = data.get('mobile', '').strip()
    
    if not mobile or len(mobile) < 10:
        return jsonify({'success': False, 'message': 'Invalid mobile number'}), 400
    
    otp = generate_otp()
    otp_storage[mobile] = {
        'otp': otp,
        'expires_at': datetime.now() + timedelta(minutes=5)
    }
    
    print(f"OTP for {mobile}: {otp}")
    return jsonify({'success': True, 'message': 'OTP sent', 'otp': otp})

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    mobile = data.get('mobile', '').strip()
    otp = data.get('otp', '').strip()
    
    if mobile not in otp_storage:
        return jsonify({'success': False, 'message': 'OTP expired'}), 400
    
    stored_data = otp_storage[mobile]
    if datetime.now() > stored_data['expires_at']:
        del otp_storage[mobile]
        return jsonify({'success': False, 'message': 'OTP expired'}), 400
    
    if stored_data['otp'] != otp:
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400
    
    del otp_storage[mobile]
    session['mobile'] = mobile
    session['verified'] = True
    
    return jsonify({'success': True, 'message': 'Verified', 'redirect': '/dashboard'})

@app.route('/api/place-order', methods=['POST'])
def place_order():
    if 'mobile' not in session or not session.get('verified'):
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    data = request.get_json()
    order_id = generate_order_id()
    
    order = {
        'order_id': order_id,
        'mobile': session.get('mobile'),
        'items': data.get('items', []),
        'total': data.get('total', 0),
        'status': 'Confirmed',
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'tracking': [
            {'status': 'Confirmed', 'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')},
            {'status': 'Processing', 'date': None},
            {'status': 'Dispatched', 'date': None},
            {'status': 'Delivered', 'date': None}
        ]
    }
    
    orders.append(order)
    return jsonify({'success': True, 'order_id': order_id})

@app.route('/api/add-to-wishlist', methods=['POST'])
def add_to_wishlist():
    if 'mobile' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    data = request.get_json()
    product_id = data.get('product_id')
    mobile = session.get('mobile')
    
    if mobile not in wishlist:
        wishlist[mobile] = []
    
    if product_id not in wishlist[mobile]:
        wishlist[mobile].append(product_id)
    
    return jsonify({'success': True, 'message': 'Added to wishlist'})

@app.route('/api/remove-from-wishlist', methods=['POST'])
def remove_from_wishlist():
    if 'mobile' not in session:
        return jsonify({'success': False, 'message': 'Not authenticated'}), 401
    
    data = request.get_json()
    product_id = data.get('product_id')
    mobile = session.get('mobile')
    
    if mobile in wishlist and product_id in wishlist[mobile]:
        wishlist[mobile].remove(product_id)
    
    return jsonify({'success': True, 'message': 'Removed from wishlist'})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
