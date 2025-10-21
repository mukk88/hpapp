// Array of house names and their corresponding audio files
const houseData = [
    { name: 'Griffindor', audioFile: 'audio/griff.mp3' },
    { name: 'Slytherin', audioFile: 'audio/griff.mp3' },
    { name: 'Hufflepuff', audioFile: 'audio/sly.mp3' },
    { name: 'Ravenclaw', audioFile: 'audio/sly.mp3' }
];

// Function to play a random house name
function playRandomHouse() {
    // Select a random house
    const randomIndex = Math.floor(Math.random() * houseData.length);
    const selectedHouse = houseData[randomIndex];
    
    // Play the selected house audio
    playHouseAudio(selectedHouse);
}

function playHouseAudio(house) {
    // Create audio element
    const audio = new Audio(house.audioFile);
    
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
    
    // Add visual feedback to the button
    const button = document.querySelector(".random-house-button");
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
        button.style.transform = "";
    }, 150);
    
    // Play the audio
    audio.play().catch(function(error) {
        status.textContent = "Error: Could not play audio";
        status.style.color = "#f44336";
        console.error('Playback error:', error);
    });
}

// Preload audio files when page loads
window.addEventListener("load", function() {
    const status = document.getElementById("status");
    status.textContent = "Loading audio files...";
    
    // Preload all audio files
    let loadedCount = 0;
    const totalFiles = houseData.length;
    
    houseData.forEach(house => {
        const audio = new Audio(house.audioFile);
        audio.preload = 'auto';
        
        audio.addEventListener('canplaythrough', function() {
            loadedCount++;
            if (loadedCount === totalFiles) {
                status.textContent = "Click the button to hear a random house!";
                status.style.color = "#fff";
            }
        });
        
        audio.addEventListener('error', function() {
            console.warn(`Could not preload ${house.name} audio`);
            loadedCount++;
            if (loadedCount === totalFiles) {
                status.textContent = "Click the button to hear a random house!";
                status.style.color = "#fff";
            }
        });
    });
});