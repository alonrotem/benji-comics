let player;
let isPlayerReady = false;

// 1. Instantly append the API Script Tag
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. Continuous Verification Loop using an Interval Fallback
// This acts as a net to catch the initialization even if the global callback finishes early.
const checkYoutubeAPI = setInterval(() => {
    if (typeof YT !== 'undefined' && YT.loaded && typeof YT.ready === 'function') {
        clearInterval(checkYoutubeAPI); // Clear the interval instantly
        
        // Use the internal engine loader wrapper to safe-mount the configuration
        YT.ready(initializePlayer);
    }
}, 50);

// 3. Fallback handle matching traditional behaviors 
window.onYouTubeIframeAPIReady = function() {
    if (!player) {
        initializePlayer();
    }
};

// 4. Primary Modular Initialization Command
function initializePlayer() {
    if (player) return; // Prevent double creation artifacts

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 0,
            'playsinline': 1,
            'rel': 0,
            'enablejsapi': 1,
            'origin': window.location.origin || '*'
        },
        events: {
            'onReady': (event) => {
                isPlayerReady = true;
                openModalBtn.disabled = false; 
                //openModalBtn.innerText = "Watch Video";
            }
        }
    });
}

// 5. Open Modal Trigger Logic
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
    if (isPlayerReady && player && typeof player.playVideo === 'function') {
        setTimeout(() => {
            player.playVideo();
        }, 50);
    }
});

// 6. Close Modal Controller 
function closeModal() {
    modalOverlay.classList.remove('active');
    if (isPlayerReady && player && typeof player.stopVideo === 'function') {
        player.stopVideo(); 
    }
}

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});