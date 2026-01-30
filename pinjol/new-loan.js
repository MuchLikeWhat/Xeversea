// Client-side validation, fee calc and optional submit to Google Apps Script endpoint
// Configure SHEET_URL after you deploy your Apps Script web app
const SHEET_URL = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYED_URL/exec';

document.addEventListener('DOMContentLoaded', () => {
  const amountEl = document.getElementById('amount');
  const termEl = document.getElementById('term');
  const reasonEl = document.getElementById('reason');
  const feeEl = document.getElementById('fee');
  const totalEl = document.getElementById('total');
  const form = document.getElementById('request');
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  const MIN = 1000, MAX = 100000, FEE_RATE = 0.03, ROUND_BASE = 500;

  function roundNearest(x, base) {
    return Math.round(x / base) * base;
  }

  function formatNum(x) {
    return Number(x).toLocaleString('en-US');
  }

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
    // client-side clamping + validity message
    if (v && v < MIN) amountEl.setCustomValidity(`Minimum is ${MIN} IDR`);
    else if (v && v > MAX) amountEl.setCustomValidity(`Maximum is ${MAX} IDR`);
    else amountEl.setCustomValidity('');
    updateFees();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    if (!form.checkValidity()) {
      msg.textContent = 'Please fill the form correctly.';
      form.reportValidity();
      return;
    }

    // Prepare payload
    const payload = {
      amount: Number(amountEl.value),
      term: termEl.value,
      reason: reasonEl.value.trim(),
      fee: Number(feeEl.textContent.replace(/,/g,'')) || 0,
      total: Number(totalEl.textContent.replace(/,/g,'')) || Number(amountEl.value) || 0,
      submittedAt: new Date().toISOString()
    };

    // Simple visual feedback
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      // If you haven't set up the Apps Script deployment, this will fail. Replace SHEET_URL first.
      const resp = await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (data && (data.success || data.result === 'success')) {
        msg.textContent = 'Request submitted successfully ✅';
        form.reset();
        updateFees();
      } else {
        msg.textContent = 'Server returned an error: ' + (data.message || JSON.stringify(data));
      }
    } catch (err) {
      msg.textContent = 'Network/server error: ' + err.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit request';
    }
  });

  updateFees();
});
