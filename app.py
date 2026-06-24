from flask import Flask, render_template, request, jsonify, session
import random
import string
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'

# In-memory storage for OTPs (use Redis/Database in production)
otp_storage = {}

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to mobile number"""
    data = request.get_json()
    mobile = data.get('mobile', '').strip()
    
    if not mobile or len(mobile) < 10:
        return jsonify({'success': False, 'message': 'Invalid mobile number'}), 400
    
    otp = generate_otp()
    # Store OTP with expiration time (5 minutes)
    otp_storage[mobile] = {
        'otp': otp,
        'expires_at': datetime.now() + timedelta(minutes=5)
    }
    
    # TODO: Integrate actual SMS service (Twilio, AWS SNS, etc.)
    print(f"OTP for {mobile}: {otp}")  # For testing
    
    return jsonify({
        'success': True,
        'message': f'OTP sent to {mobile}',
        'otp': otp  # Remove in production
    })

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP"""
    data = request.get_json()
    mobile = data.get('mobile', '').strip()
    otp = data.get('otp', '').strip()
    
    if mobile not in otp_storage:
        return jsonify({'success': False, 'message': 'OTP not found or expired'}), 400
    
    stored_data = otp_storage[mobile]
    
    # Check expiration
    if datetime.now() > stored_data['expires_at']:
        del otp_storage[mobile]
        return jsonify({'success': False, 'message': 'OTP expired'}), 400
    
    # Verify OTP
    if stored_data['otp'] != otp:
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400
    
    # OTP verified
    del otp_storage[mobile]
    session['mobile'] = mobile
    session['verified'] = True
    
    return jsonify({
        'success': True,
        'message': 'OTP verified successfully',
        'redirect': '/dashboard'
    })

@app.route('/api/services', methods=['GET'])
def get_services():
    """Get available services"""
    services = [
        {'id': 1, 'name': 'PDF Creation', 'price_in': 500, 'price_int': 20},
        {'id': 2, 'name': 'Animated Video', 'price_in': 1000, 'price_int': 40},
        {'id': 3, 'name': 'Video Editing', 'price_in': 800, 'price_int': 30},
        {'id': 4, 'name': 'Image Editing', 'price_in': 300, 'price_int': 12}
    ]
    return jsonify(services)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
