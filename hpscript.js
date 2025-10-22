// Array of house names and their corresponding audio files
const houseData = [
    { name: 'Griffindor', audioFile: 'grifflong.m4a', shortAudioFile: 'griff.mp3' },
    { name: 'Slytherin', audioFile: 'slylong.mp3', shortAudioFile: 'sly.mp3' },
    { name: 'Hufflepuff', audioFile: 'hufflong.mp3', shortAudioFile: 'huff.mp3' },
    { name: 'Ravenclaw', audioFile: 'rav.mp3', shortAudioFile: 'ravshort.mov' }
];

let currentAudio = null;
let currentStopTimeoutId = null;

// Function to play a random house name
function playRandomHouse(mode = 'long', buttonEl = null) {
    const randomIndex = Math.floor(Math.random() * houseData.length);
    const selectedHouse = houseData[randomIndex];
    playHouseAudio(selectedHouse, mode, buttonEl);
}

function getAudioSrc(house, mode) {
    if (mode === 'short') {
        return house.shortAudioFile || house.audioFile;
    }
    return house.audioFile || house.shortAudioFile;
}

function playHouseAudio(house, mode = 'long', buttonEl = null) {
    // Stop any existing audio first
    if (currentStopTimeoutId) {
        clearTimeout(currentStopTimeoutId);
        currentStopTimeoutId = null;
    }
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (_) {}
    }

    // Create and store the new audio element
    const source = getAudioSrc(house, mode);
    const audio = new Audio(source);
    currentAudio = audio;
    
    // Update status
    const status = document.getElementById("status");
    status.textContent = `Playing: ${house.name}`;
    status.style.color = "#4CAF50";
    
    // Handle when audio starts
    audio.addEventListener('loadstart', function() {
        status.textContent = `Loading: ${house.name}`;
    });
    
    audio.addEventListener('canplay', function() {
        status.textContent = `Playing: ${house.name}`;
    });
    
    // Handle when audio ends
    audio.addEventListener('ended', function() {
        status.textContent = "Click the button to hear a random house!";
        status.style.color = "#fff";
    });
    
    // Handle errors
    audio.addEventListener('error', function(event) {
        status.textContent = `Error: Could not play ${house.name} audio`;
        status.style.color = "#f44336";
        console.error('Audio error:', event);
    });
    
    // Add visual feedback to the clicked button
    const button = buttonEl || document.querySelector(".random-house-button");
    if (button) {
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
            button.style.transform = "";
        }, 150);
    }
    
    // Play the audio
    audio.play().catch(function(error) {
        status.textContent = "Error: Could not play audio";
        status.style.color = "#f44336";
        console.error('Playback error:', error);
    });
}

// Helper: play a specific house by name (exact match on houseData.name)
function playHouseByName(houseName, mode = 'long', buttonEl = null) {
    const house = houseData.find(h => h.name === houseName);
    const status = document.getElementById("status");
    if (!house) {
        status.textContent = `Error: Unknown house '${houseName}'`;
        status.style.color = "#f44336";
        return;
    }
    playHouseAudio(house, mode, buttonEl);
}

// Preload audio files when page loads
window.addEventListener("load", function() {
    const status = document.getElementById("status");
    status.textContent = "Loading audio files...";
    
    // Preload all unique audio sources (both long and short)
    const sources = new Set();
    houseData.forEach(h => {
        if (h.audioFile) sources.add(h.audioFile);
        if (h.shortAudioFile) sources.add(h.shortAudioFile);
    });
    let loadedCount = 0;
    const totalFiles = sources.size;
    if (totalFiles === 0) {
        status.textContent = "Click the button to hear a random house!";
        status.style.color = "#fff";
        return;
    }
    sources.forEach(src => {
        const a = new Audio(src);
        a.preload = 'auto';
        a.addEventListener('canplaythrough', function() {
            loadedCount++;
            if (loadedCount === totalFiles) {
                status.textContent = "Click the button to hear a random house!";
                status.style.color = "#fff";
            }
        });
        a.addEventListener('error', function() {
            // Continue even if a source fails to preload
            loadedCount++;
            if (loadedCount === totalFiles) {
                status.textContent = "Click the button to hear a random house!";
                status.style.color = "#fff";
            }
        });
    });
});