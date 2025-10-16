let listenButton = document.getElementById('listenButton');
let clearButton = document.getElementById('clearButton');
let questionsArea = document.getElementById('questionsArea');
let answersArea = document.getElementById('answersArea');
let apiKeyInput = document.getElementById('apiKeyInput');
let saveApiKeyButton = document.getElementById('saveApiKey');
let deleteApiKeyButton = document.getElementById('deleteApiKey');
let modal = document.getElementById('modal');
let modalMessage = document.getElementById('modal-message');
let closeModal = document.getElementsByClassName('close')[0];
let modalLogo = document.getElementById('modal-logo');

// Logo hide functionality removed for new layout

// Check for existing API key on load
window.addEventListener('load', async () => {
    const hasApiKey = await eel.has_api_key()();
    updateApiKeyUI(hasApiKey);
});

listenButton.addEventListener('click', async () => {
    let isListening = await eel.toggle_listening()();
    listenButton.textContent = isListening ? 'Stop Listening' : 'Start Listening';
    listenButton.classList.toggle('listening', isListening);
    
    if (isListening) {
        let spinner = document.createElement('div');
        spinner.className = 'spinner';
        listenButton.appendChild(spinner);
    }
});

clearButton.addEventListener('click', () => {
    questionsArea.innerHTML = '';
    answersArea.innerHTML = '';
});

saveApiKeyButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        const result = await eel.save_api_key(apiKey)();
        if (result) {
            showModal('Gemini API key saved successfully!', 'Gemini_icon.webp');
            apiKeyInput.value = '';
            updateApiKeyUI(true);
        } else {
            showModal('Failed to save API key. Please try again.');
        }
    } else {
        showModal('Please enter a valid API key.');
    }
});

deleteApiKeyButton.addEventListener('click', async () => {
    const result = await eel.delete_api_key()();
    if (result) {
        showModal('API key removed successfully!');
        updateApiKeyUI(false);
    } else {
        showModal('Failed to delete API key. Please try again.');
    }
});

function updateApiKeyUI(hasApiKey) {
    apiKeyInput.style.display = hasApiKey ? 'none' : 'inline-block';
    saveApiKeyButton.style.display = hasApiKey ? 'none' : 'inline-block';
    deleteApiKeyButton.style.display = hasApiKey ? 'inline-block' : 'none';
    listenButton.disabled = !hasApiKey;
}

function showModal(message, logoSrc = null) {
    modalMessage.textContent = message;
    modalMessage.className = 'text-center'; // Ensure text is always centered
    if (logoSrc) {
        modalLogo.src = logoSrc;
        modalLogo.style.display = 'block';
    } else {
        modalLogo.style.display = 'none';
    }
    modal.style.display = 'block';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

let latestAnswerText = '';
let isMuted = false;

eel.expose(update_ui);
function update_ui(question, answer) {
    if (question) {
        let p = document.createElement('p');
        p.textContent = question;
        questionsArea.appendChild(p);
        questionsArea.scrollTop = questionsArea.scrollHeight;
    }
    if (answer) {
        let container = document.createElement('div');
        container.className = 'answer-item';
        try {
            const parsedAnswer = JSON.parse(answer);
            const text = parsedAnswer.text;
            latestAnswerText = text;
            let p = document.createElement('p');
            p.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            container.appendChild(p);
        } catch (e) {
            console.error("Error parsing answer:", e);
            let p = document.createElement('p');
            p.textContent = answer;
            container.appendChild(p);
            latestAnswerText = answer;
        }

        answersArea.appendChild(container);
        answersArea.scrollTop = answersArea.scrollHeight;

        // Auto-speak if not muted
        if (!isMuted && latestAnswerText && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            let utterance = new SpeechSynthesisUtterance(latestAnswerText);
            window.speechSynthesis.speak(utterance);
        }
    }
}

// Add mute/unmute button to the answers header
document.addEventListener('DOMContentLoaded', function() {
    let answersHeader = document.querySelector('.answers h2');
    if (answersHeader) {
        let muteButton = document.createElement('button');
        muteButton.id = 'muteButton';
        muteButton.innerHTML = isMuted ? '🔇 Unmute' : '🔊 Mute';
        muteButton.title = 'Toggle speech mute';
        muteButton.onclick = function() {
            isMuted = !isMuted;
            muteButton.innerHTML = isMuted ? '🔇 Unmute' : '🔊 Mute';
            if (isMuted) {
                window.speechSynthesis.cancel(); // Stop any ongoing speech
            } else {
                // If unmuting, speak the latest answer
                if (latestAnswerText && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel(); // Cancel any ongoing speech
                    let utterance = new SpeechSynthesisUtterance(latestAnswerText);
                    window.speechSynthesis.speak(utterance);
                }
            }
        };
        answersHeader.appendChild(muteButton);
    }
});


