let timerInterval;
let currentMobile = '';

// Mobile Form
document.getElementById('form-mobile')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const errorEl = document.getElementById('mobile-error');
    
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
        errorEl.textContent = 'Enter valid 10-digit mobile';
        return;
    }
    
    try {
        const res = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        });
        const data = await res.json();
        
        if (data.success) {
            currentMobile = mobile;
            document.getElementById('show-mobile').textContent = mobile;
            document.getElementById('step-1').classList.remove('active');
            document.getElementById('step-2').classList.add('active');
            startTimer();
            console.log('OTP:', data.otp);
        } else {
            errorEl.textContent = data.message;
        }
    } catch (err) {
        errorEl.textContent = 'Error: ' + err.message;
    }
});

// OTP Auto-advance
document.querySelectorAll('.otp-input').forEach((input, idx) => {
    input.addEventListener('keyup', (e) => {
        if (/\d/.test(e.key) && idx < 5) {
            document.querySelectorAll('.otp-input')[idx + 1].focus();
        } else if (e.key === 'Backspace' && idx > 0) {
            document.querySelectorAll('.otp-input')[idx - 1].focus();
        }
    });
});

// Timer
function startTimer(seconds = 300) {
    let time = seconds;
    timerInterval = setInterval(() => {
        const m = Math.floor(time / 60);
        const s = time % 60;
        document.getElementById('timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (--time < 0) clearInterval(timerInterval);
    }, 1000);
}

// Verify OTP
async function verifyOTP() {
    const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
    const errorEl = document.getElementById('otp-error');
    
    if (otp.length !== 6) {
        errorEl.textContent = 'Enter all 6 digits';
        return;
    }
    
    try {
        const res = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: currentMobile, otp })
        });
        const data = await res.json();
        
        if (data.success) {
            setTimeout(() => window.location.href = '/dashboard', 1000);
        } else {
            errorEl.textContent = data.message;
        }
    } catch (err) {
        errorEl.textContent = 'Error: ' + err.message;
    }
}

// Resend
async function resendOTP() {
    const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: currentMobile })
    });
    const data = await res.json();
    if (data.success) {
        clearInterval(timerInterval);
        startTimer();
        console.log('New OTP:', data.otp);
    }
}
