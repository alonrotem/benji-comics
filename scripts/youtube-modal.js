// CONFIGURATION CONFIG
/*
const videoId = 'dQw4w9WgXcQ'; 
const aspectRatio = '4:3'; // Options: '4:3', '16:9', '1:1'
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const videoContainer = document.getElementById('videoContainer');
*/
// CONFIGURATION PARAMETERS
let player;
let isApiReady = false;

// 1. Calculate dynamic layout dimension bounding values
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

// 2. Load API Engine Assets Safely
const tag = document.createElement('script');
tag.src = "https://youtube.com";
const scripts = document.getElementsByTagName('script');
if (scripts.length > 0) {
    scripts[0].parentNode.insertBefore(tag, scripts[0]);
} else {
    document.head.appendChild(tag);
}

// 3. Keep verification hooks open
const checkYoutubeAPI = setInterval(() => {
    if (typeof YT !== 'undefined' && YT.loaded && typeof YT.ready === 'function') {
        clearInterval(checkYoutubeAPI);
        YT.ready(() => {
            isApiReady = true;
            openModalBtn.disabled = false;
            openModalBtn.innerText = "Watch Video";
        });
    }
}, 50);

window.onYouTubeIframeAPIReady = function() {
    isApiReady = true;
    openModalBtn.disabled = false;
    openModalBtn.innerText = "Watch Video";
};

// 4. Dynamic initialization on open
// Instantiating the frame after elements render prevents blank layout errors
function createPlayerInstance() {
    // Re-create the targeted placement anchor if previous instance destroyed it
    if (!document.getElementById('player')) {
        const newDiv = document.createElement('div');
        newDiv.id = 'player';
        videoContainer.appendChild(newDiv);
    }

    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1, // Automatically starts once the source establishes communication
            'playsinline': 1,
            'rel': 0,
            'enablejsapi': 1,
            'origin': window.location.origin || '*'
        }
    });
}

// 5. Open Controller Interceptor
openModalBtn.addEventListener('click', () => {
    modalOverlay.style.visibility = "visible"; 
    modalOverlay.classList.add('active');
    
    if (isApiReady) {
        // Short delay lets the layout finish expansion scaling before instantiation
        setTimeout(() => {
            createPlayerInstance();
        }, 200);
    }
});

// 6. Complete Destruction on Close
// Destroying the instance forces the visibility layer to shut down and unmount properly
function closeModal() {
    modalOverlay.classList.remove('active');
    if (player && typeof player.destroy === 'function') {
        player.destroy(); // Tears down the subframe entirely to halt background audio paths
        player = null;
    }
}

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// 7. Cleanup Display Attributes
modalOverlay.addEventListener('transitionend', (e) => {
    if (!modalOverlay.classList.contains('active') && e.propertyName === 'opacity') {
        modalOverlay.style.visibility = "hidden";
    }
});