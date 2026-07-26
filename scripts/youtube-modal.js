/*
const aspectRatio = '4:3'; // Options: '4:3', '16:9', '1:1', '21:9'
const videoId = 'dQw4w9WgXcQ'; 
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const videoContainer = document.getElementById('videoContainer');
*/


let player;
let isPlayerReady = false;

// 1. Calculate and set the aspect ratio dynamically
function applyAspectRatio(ratio) {
    const parts = ratio.split(':');
    if (parts.length === 2) {
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        const paddingPercentage = (height / width) * 100;
        videoContainer.style.paddingBottom = `${paddingPercentage}%`;
    }
}
applyAspectRatio(aspectRatio);

// 2. Asynchronously load the official IFrame API
const tag = document.createElement('script');
tag.src = "https://youtube.com";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. API Initialization Polling Loop
const checkYoutubeAPI = setInterval(() => {
    if (typeof YT !== 'undefined' && YT.loaded && typeof YT.ready === 'function') {
        clearInterval(checkYoutubeAPI);
        YT.ready(initializePlayer);
    }
}, 50);

window.onYouTubeIframeAPIReady = function() {
    if (!player) initializePlayer();
};

function initializePlayer() {
    if (player) return;

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
            'onReady': () => {
                isPlayerReady = true;
                openModalBtn.disabled = false; 
                openModalBtn.innerText = "Watch Video";
            }
        }
    });
}

// 4. Open Modal Control
openModalBtn.addEventListener('click', () => {
    modalOverlay.style.visibility = "visible"; // Force visibility flip before transition triggers
    modalOverlay.classList.add('active');
    if (isPlayerReady && player && typeof player.playVideo === 'function') {
        setTimeout(() => {
            player.playVideo();
        }, 50);
    }
});

// 5. Close Modal Control
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

// 6. Safe Animation End Event Listener
// Completely strips visibility states only after the overlay opacity transition finishes fading out
modalOverlay.addEventListener('transitionend', (e) => {
    if (!modalOverlay.classList.contains('active') && e.propertyName === 'opacity') {
        modalOverlay.style.visibility = "hidden";
    }
});