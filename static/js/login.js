// OTP Login
const form = document.getElementById('loginForm');
const mobileInput = document.getElementById('mobile');
const otpInput = document.getElementById('otp');
const mobileError = document.getElementById('mobileError');
const otpError = document.getElementById('otpError');
const otpSection = document.getElementById('otpSection');
const submitSection = document.getElementById('submitSection');
const getOtpBtn = document.getElementById('getOtpBtn');
const verifyBtn = document.getElementById('verifyBtn');
const resendBtn = document.getElementById('resendBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

let resendTimeout = 0;

function validateMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

getOtpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    mobileError.textContent = '';
    
    const mobile = mobileInput.value.trim();
    
    if (!validateMobile(mobile)) {
        mobileError.textContent = 'Please enter a valid 10-digit mobile number';
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mobileInput.disabled = true;
            submitSection.classList.add('hidden');
            otpSection.classList.remove('hidden');
            alert(`OTP: ${data.otp}`);
            startResendTimer();
        } else {
            mobileError.textContent = data.message || 'Failed to send OTP';
        }
    } catch (error) {
        console.error('Error:', error);
        mobileError.textContent = 'Error sending OTP. Please try again.';
    } finally {
        hideLoading();
    }
});

verifyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    otpError.textContent = '';
    
    const mobile = mobileInput.value.trim();
    const otp = otpInput.value.trim();
    
    if (!otp || otp.length !== 6) {
        otpError.textContent = 'Please enter a valid 6-digit OTP';
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, otp })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = data.redirect;
        } else {
            otpError.textContent = data.message || 'Invalid OTP';
        }
    } catch (error) {
        console.error('Error:', error);
        otpError.textContent = 'Error verifying OTP. Please try again.';
    } finally {
        hideLoading();
    }
});

resendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if (resendTimeout > 0) {
        otpError.textContent = `Please wait ${resendTimeout} seconds`;
        return;
    }
    
    showLoading();
    
    try {
        const mobile = mobileInput.value.trim();
        const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            otpError.textContent = '';
            otpInput.value = '';
            alert(`New OTP: ${data.otp}`);
            startResendTimer();
        } else {
            otpError.textContent = data.message || 'Failed to resend OTP';
        }
    } catch (error) {
        console.error('Error:', error);
        otpError.textContent = 'Error resending OTP. Please try again.';
    } finally {
        hideLoading();
    }
});

function startResendTimer() {
    resendTimeout = 30;
    resendBtn.disabled = true;
    resendBtn.textContent = `Resend OTP (${resendTimeout}s)`;
    
    const interval = setInterval(() => {
        resendTimeout--;
        resendBtn.textContent = `Resend OTP (${resendTimeout}s)`;
        
        if (resendTimeout === 0) {
            clearInterval(interval);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend OTP';
        }
    }, 1000);
}

mobileInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
});

otpInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});
