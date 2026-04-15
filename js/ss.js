(function(){
        const iframe = document.querySelector('.pdf-container iframe');
        const openBtn = document.getElementById('openTab');
        const toolbarToggle = document.getElementById('toggleToolbar');

        if(!iframe || !openBtn || !toolbarToggle) return;
        
        // Open in new tab function
        openBtn.addEventListener('click', function(){
            window.open(iframe.src.split('#')[0], '_blank');
        });

        // Toggle toolbar function
        function setToolbar(show){
            const base = iframe.src.split('#')[0].split('?')[0];
            const hash = show ? '#toolbar=1' : '#toolbar=0';
            const cache = '?_=' + Date.now();
            iframe.src = base + cache + hash;
            try{ history.replaceState(null, '', window.location.pathname + (show ? '#toolbar=1' : '') ); } catch(e){}
        }

        const hash = new URLSearchParams(window.location.hash.replace('#',''));
        const show = hash.get('toolbar') !== '0';
        setToolbar(show);

        // Toggle toolbar on click
        toolbarToggle.addEventListener('click', function(){
            const current = iframe.src.includes('#toolbar=1');
            setToolbar(!current);
    });
})();