// Initialize CodeMirror
const editor = CodeMirror(document.getElementById("editor"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "default",
    height: "100%",
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const codeInput = editor.getValue(); // Get code from CodeMirror editor
    if (userInput.trim() === "" && codeInput.trim() === "") return; // Don't send empty messages

    addMessageToChat(userInput, 'user');

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput, code: codeInput }), // Include code in the request
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            addMessageToChat(data.response, 'bot');
        } else if (data.error) {
            addMessageToChat("Error: " + data.error, 'bot');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById("user-input").value = ""; // Clear user input
}

// Function to add messages to chat
function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById("chat-container");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender + "-message");
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}

// Event listener for Enter key
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
