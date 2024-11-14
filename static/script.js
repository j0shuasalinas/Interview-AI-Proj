document.addEventListener('DOMContentLoaded', () => {
    const editor = CodeMirror(document.getElementById("editor"), {
        mode: "javascript",
        lineNumbers: true,
        theme: "default",
        viewportMargin: Infinity  // To make the code box expand
    });

    let audioEnabled = false;
    const audioToggleButton = document.getElementById("audio-toggle-button");

    audioToggleButton.addEventListener("click", () => {
        audioEnabled = !audioEnabled;
        audioToggleButton.textContent = audioEnabled ? "🔊 Audio On" : "🔇 Audio Off";
    });

    function textToSpeech(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1; // Adjust as needed
        utterance.pitch = 1; // Adjust as needed
        synth.speak(utterance);
    }

    function sendMessage() {
        const userInput = document.getElementById("user-input").value;
        const codeInput = editor.getValue();

        if (userInput.trim() === "" && codeInput.trim() === "") return;

        addMessageToChat(userInput, 'user');

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, code: codeInput }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                addMessageToChat(data.response, 'bot');
                if (audioEnabled) {
                    textToSpeech(data.response);
                }
            } else if (data.error) {
                addMessageToChat("Error: " + data.error, 'bot');
            }
        })
        .catch(error => console.error('Error:', error));

        document.getElementById("user-input").value = "";
    }

    function addMessageToChat(message, sender) {
        const chatContainer = document.getElementById("chat-container");
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") sendMessage();
    });
});
