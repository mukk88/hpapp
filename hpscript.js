
// Array of house names
const houseNames = ['Griffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

// Function to play a random house name
function playRandomHouse() {
    // Select a random house name
    const randomIndex = Math.floor(Math.random() * houseNames.length);
    const selectedHouse = houseNames[randomIndex];
    
    // Play the selected house name
    playHouseName(selectedHouse);
}

function playHouseName(houseName) {
    // Check if the browser supports speech synthesis
    if ("speechSynthesis" in window) {
        // Create a new speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(houseName);
        
        // Configure the speech settings
        utterance.rate = 1.2; // Slightly slower for dramatic effect
        utterance.pitch = 0.5;
        utterance.volume = 40.0;
        
        // Try to use a British accent if available
        const voices = speechSynthesis.getVoices();
        const britishVoice = voices.find(voice => 
            voice.lang.includes("en-GB") || 
            voice.name.includes("British") ||
            voice.name.includes("UK")
        );
        
        if (britishVoice) {
            utterance.voice = britishVoice;
        }
        
        // Update status
        const status = document.getElementById("status");
        status.textContent = `Speaking: ${houseName}`;
        status.style.color = "#4CAF50";
        
        // Handle when speech starts
        utterance.onstart = function() {
            status.textContent = `Speaking: ${houseName}`;
        };
        
        // Handle when speech ends
        utterance.onend = function() {
            status.textContent = "Click a house to hear its name!";
            status.style.color = "#fff";
        };
        
        // Handle errors
        utterance.onerror = function(event) {
            status.textContent = "Error: Could not speak the house name";
            status.style.color = "#f44336";
        };
        
        // Speak the house name
        speechSynthesis.speak(utterance);
        
        // Add visual feedback to the button
        const button = document.querySelector(".random-house-button");
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
            button.style.transform = "";
        }, 150);
        
    } else {
        // Fallback for browsers that don't support speech synthesis
        const status = document.getElementById("status");
        status.textContent = "Sorry, your browser does not support speech synthesis";
        status.style.color = "#f44336";
    }
}

// Load voices when the page loads
window.addEventListener("load", function() {
    // Some browsers need a delay to load voices
    setTimeout(() => {
        speechSynthesis.getVoices();
    }, 100);
});

// Handle voice changes
speechSynthesis.addEventListener("voiceschanged", function() {
    // Voices are now available
    console.log("Voices loaded:", speechSynthesis.getVoices().length);
});
