# URGENTDATA - Form Website

A professional Flask-based web application for collecting user data and managing OTP-based authentication.

## Features

- ✅ OTP-based authentication system
- ✅ Mobile number validation
- ✅ Responsive design
- ✅ Service listing dashboard
- ✅ Modern UI with gradient backgrounds
- ✅ Error handling
- ✅ Resend OTP functionality

## Project Structure

```
Urgentdata-/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   ├── index.html        # Home page with OTP form
│   └── dashboard.html    # Dashboard page
└── static/
    ├── css/
    │   └── style.css     # Styling
    └── js/
        ├── script.js     # OTP form logic
        └── dashboard.js  # Dashboard logic
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gupta07ashok-lgtm/Urgentdata-.git
cd Urgentdata-
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python app.py
```

The application will start at `http://localhost:5000`

## Usage

1. Enter a 10-digit mobile number
2. Click "Get OTP"
3. Enter the OTP sent to your mobile (for testing, OTP is displayed in alert)
4. Click "Verify OTP"
5. Access the dashboard with available services

## API Endpoints

### Send OTP
- **POST** `/api/send-otp`
- **Body:** `{ "mobile": "1234567890" }`
- **Response:** `{ "success": true, "message": "OTP sent", "otp": "123456" }`

### Verify OTP
- **POST** `/api/verify-otp`
- **Body:** `{ "mobile": "1234567890", "otp": "123456" }`
- **Response:** `{ "success": true, "message": "OTP verified", "redirect": "/dashboard" }`

### Get Services
- **GET** `/api/services`
- **Response:** Array of service objects

## Configuration

### Security Settings
- Change `app.secret_key` in `app.py` for production
- Update `debug=False` for production
- Disable OTP display in alerts for production

### SMS Integration
- Replace the TODO comment in `send_otp()` with actual SMS service (Twilio, AWS SNS, etc.)
- Store OTPs in database or Redis instead of memory for production

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] SMS gateway integration
- [ ] Payment processing
- [ ] Admin dashboard
- [ ] Service ordering system
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Better error handling

## License

MIT License
