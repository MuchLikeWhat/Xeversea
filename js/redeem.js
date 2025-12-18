let pendingCode = null;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('codeForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.getElementById('code').value.toLowerCase();

    const secureCodes = ['outofkalidoni', 'futurecode'];

    if (secureCodes.includes(code)) {
      pendingCode = code;
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('recaptcha').style.display = 'block';
      return;
    }

    // === WrittenbyPaperoni===
    switch (code) {
      case 'freegift69':
        const video = document.getElementById('rickrollVideo');
        document.getElementById('rickroll').style.display = 'block';
        video.play()
          .then(() => totallynotprank())
          .catch(error => console.error(`Error attempting fullscreen: ${error}`));
        document.addEventListener('fullscreenchange', () => {
          if (!document.fullscreenElement) totallynotprank();
        });
        document.addEventListener('keydown', (e) => {
          const blockedKeys = ['Escape', 'F11'];
          const ctrlCombos = ['w', 'r', 't', 'n'];
          if (blockedKeys.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (e.ctrlKey && ctrlCombos.includes(e.key.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
        break;

      case 'omagachikennuget':
        fetch('https://ipinfo.io/json')
          .then(response => response.json())
          .then(data => {
            fetch('https://mqprtorkbjflarpbjdrr.supabase.co/functions/v1/log-ip', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ip: data.ip })
            });
          });
        document.getElementById('recaptcha').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        break;

      default:
        document.getElementById('invalid').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        break;
    }
  });
});

window.onCaptchaSuccess = function () {
  if (!pendingCode) return;

  switch (pendingCode) {
    case 'outofkalidoni':
      window.location.replace('https://xeversea.sytes.net/kalidoni');
      break;

    case 'futurecode':
      alert('🎉 Future code unlocked!');
      break;

    default:
      console.warn('Unknown pending code after captcha:', pendingCode);
      break;
  }

  pendingCode = null;
  document.getElementById('recaptcha').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
    grecaptcha.reset();
  }
};

function totallynotprank() {
  const video = document.getElementById('rickrollVideo');
  if (video.requestFullscreen) video.requestFullscreen();
  else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
  else if (video.msRequestFullscreen) video.msRequestFullscreen();
}
