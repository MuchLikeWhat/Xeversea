// Client-side validation, fee calc and optional submit to Google Apps Script endpoint
// Configure SHEET_URL after you deploy your Apps Script web app
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzQfTHyEOlcYNbyQVGwmkLAWxd2ZOXADxYZMZAyqoiue2PHDp5zDebmCl9ZxTjZlhVZ/exec'; // set to your deployed Apps Script URL to enable submission
const DEMO_MODE = !SHEET_URL;

document.addEventListener('DOMContentLoaded', () => {
  const emailEl = document.getElementById('email');
  const verifyCodeEl = document.getElementById('verify-code');
  const phoneEl = document.getElementById('phone');
  const amountEl = document.getElementById('amount');
  const termEl = document.getElementById('term');
  const reasonEl = document.getElementById('reason');
  const feeEl = document.getElementById('fee');
  const totalEl = document.getElementById('total');
  const form = document.getElementById('request');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const hpEl = document.getElementById('hp');
  const agreeEl = document.getElementById('agree');

  let lastSubmitTime = 0;
  const MIN = 1000, MAX = 100000, FEE_RATE = 0.03, ROUND_BASE = 500, COOLDOWN_MS = 10000;

  function roundNearest(x, base) { return Math.round(x / base) * base; }
  function formatNum(x) { return Number(x).toLocaleString('en-US'); }

  function updateFees() {
    const val = Number(amountEl.value) || 0;
    if (val >= MIN && val <= MAX) {
      let fee = val * FEE_RATE;
      fee = roundNearest(fee, ROUND_BASE);
      feeEl.textContent = formatNum(fee);
      totalEl.textContent = formatNum(val + fee);
    } else {
      feeEl.textContent = '-';
      totalEl.textContent = '-';
    }
  }

  amountEl.addEventListener('input', () => {
    const v = Number(amountEl.value);
    if (v && v < MIN) amountEl.setCustomValidity(`Minimum is ${MIN} IDR`);
    else if (v && v > MAX) amountEl.setCustomValidity(`Maximum is ${MAX} IDR`);
    else amountEl.setCustomValidity('');
    updateFees();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    if (hpEl && hpEl.value.trim()) {
      msg.textContent = 'Bot detected — submission blocked.';
      return;
    }

    // Verify email code
    const storedCode = localStorage.getItem('verify_code');
    const storedEmail = localStorage.getItem('verify_email');
    if (!storedCode || !verifyCodeEl.value || verifyCodeEl.value !== storedCode) {
      msg.textContent = 'Please enter a valid verification code first.';
      verifyCodeEl.focus();
      return;
    }
    /*if (emailEl.value.trim() !== storedEmail) {
      msg.textContent = 'Email does not match verification code.';
      emailEl.focus();
      return;
    }*/

    if (agreeEl && !agreeEl.checked) {
      msg.textContent = 'You must agree to the loan rules before submitting.';
      agreeEl.focus();
      return;
    }

    if (!form.checkValidity()) {
      msg.textContent = 'Please fill the form correctly.';
      form.reportValidity();
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime < COOLDOWN_MS) {
      msg.textContent = 'Please wait a few seconds before submitting again.';
      return;
    }
    lastSubmitTime = now;

    const payload = {
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim() || '',
      amount: Number(amountEl.value),
      term: termEl.value,
      reason: reasonEl.value.trim(),
      fee: Number(feeEl.textContent.replace(/,/g,'')) || 0,
      total: Number(totalEl.textContent.replace(/,/g,'')) || Number(amountEl.value) || 0,
      repayMethod: (document.getElementById('repay-method')||{}).value || '',
      submittedAt: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      if (DEMO_MODE) {
        console.log('Demo mode payload:', payload);
        msg.textContent = 'Demo: request captured locally. Configure `SHEET_URL` to enable submission.';
        form.reset();
        localStorage.removeItem('verify_code');
        localStorage.removeItem('verify_email');
        verifyCodeEl.disabled = true;
        verifyCodeEl.value = '';
        updateFees();
      } else {
        const resp = await fetch(SHEET_URL, {
          redirect: 'follow',
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
        });
        const data = await resp.json();
        if (data && (data.success || data.result === 'success')) {
          msg.textContent = 'Request submitted successfully ✅';
          form.reset();
          updateFees();
        } else {
          msg.textContent = 'Server returned an error: ' + (data.message || JSON.stringify(data));
        }
      }
    } catch (err) {
      msg.textContent = 'Network/server error: ' + err.message;
    } finally {
      setTimeout(() => { submitBtn.disabled = false; submitBtn.textContent = 'Submit request'; }, COOLDOWN_MS);
    }
  });

  updateFees();
});
