let currentPage = 0;
let totalPages = 0;
let soundEnabled = true;
let rabbitCount = 0;
let totalRabbits = 8;

// Sound Elements
const sounds = {
    turn: document.getElementById('snd-turn'),
    yay: document.getElementById('snd-yay'),
    ocean: document.getElementById('snd-ocean'),
    sword: document.getElementById('snd-sword'),
    cannon: document.getElementById('snd-cannon'),
    bells: document.getElementById('snd-bells'),
    pop: document.getElementById('snd-pop'),
    siren: document.getElementById('snd-siren'),
    plane: document.getElementById('snd-plane')
};

function init() {
    // Determine total rabbits from body data attribute
    const rabbitData = document.body.getAttribute('data-total-rabbits');
    if (rabbitData) {
        totalRabbits = parseInt(rabbitData, 10);
    }

    // Count pages
    const pages = document.querySelectorAll('.page');
    totalPages = pages.length;

    updateRabbitCounter();
    updateDisplay();

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') previousPage();
    });

    // Show game tip
    setTimeout(() => {
        const tip = document.getElementById('gameTip');
        if (tip) {
            tip.style.display = 'block';
            setTimeout(() => {
                tip.style.display = 'none';
            }, 5000);
        }
    }, 1000);
}

function updateRabbitCounter() {
    const el = document.getElementById('rabbit-count');
    if (el) el.innerText = rabbitCount + "/" + totalRabbits + " Found";
}

function updateDisplay() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.style.display = 'none';
        p.classList.remove('active');
    });

    if (pages[currentPage]) {
        pages[currentPage].style.display = 'flex';
        // Trigger reflow for animation
        setTimeout(() => pages[currentPage].classList.add('active'), 10);
    }

    // Hide controls on cover page, show on others
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.style.display = currentPage === 0 ? 'none' : 'flex';
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) {
        if (currentPage === totalPages - 1) {
            nextBtn.innerText = 'Home 🏠';
            nextBtn.onclick = () => window.location.href = 'index.html';
        } else {
            nextBtn.innerText = 'Next →';
            nextBtn.onclick = nextPage;
        }
    }
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        playSound('turn');
        updateDisplay();
    }
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        playSound('turn');
        updateDisplay();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sndBtn');
    if (btn) btn.innerText = soundEnabled ? '🔊' : '🔇';

    if (soundEnabled) {
        if (currentPage === 0) tryPlayOcean();
    } else {
        if (sounds.ocean) sounds.ocean.pause();
    }
}

function playSound(name) {
    if (!soundEnabled) return;
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log("Audio play failed / user interaction needed"));
    }
}

function tryPlayOcean() {
    if (sounds.ocean) {
        sounds.ocean.volume = 0.3;
        sounds.ocean.play().catch(e => { });
    }
}

// Rabbit Game
function foundRabbit(element) {
    if (element.classList.contains('found')) return;

    element.classList.add('found');
    rabbitCount++;
    updateRabbitCounter();
    playSound('pop');

    if (rabbitCount === totalRabbits) {
        setTimeout(() => {
            const victoryModal = document.getElementById('victoryModal');
            if (victoryModal) victoryModal.style.display = 'flex';
            playSound('yay');
            playSound('bells');
        }, 500);
    }
}

function closeVictory() {
    document.getElementById('victoryModal').style.display = 'none';
}

// Map
function toggleMap() {
    const modal = document.getElementById('mapModal');
    if (modal) modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function zoomMap(location) {
    alert("This place was vital during the siege!");
}

function showRealPhoto(src, caption) {
    const modal = document.getElementById('photoModal');
    const img = document.getElementById('realPhotoImg');
    const cap = document.getElementById('photoCaption');

    if (img) img.src = src;
    if (cap) cap.innerText = caption;
    if (modal) modal.style.display = 'flex';
}

function closePhoto() {
    const modal = document.getElementById('photoModal');
    if (modal) modal.style.display = 'none';
}

// Interaction
function animateElement(element, animationClass) {
    element.classList.remove(animationClass);
    void element.offsetWidth; // trigger reflow
    element.classList.add(animationClass);
}

function interactFood(element) {
    animateElement(element, 'popped');
    playSound('pop');
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
    }, 200);
}

function fireCannon(element) {
    animateElement(element, 'popped');
    playSound('cannon');
    // Shake the screen
    document.body.style.animation = "shake 0.5s";
    setTimeout(() => document.body.style.animation = "", 500);
}

// Start
window.addEventListener('load', init);
