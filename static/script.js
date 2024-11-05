// Wait until the DOM is fully loaded before initializing CodeMirror
document.addEventListener('DOMContentLoaded', () => {
    const editor = CodeMirror(document.getElementById("editor"), {
        mode: "javascript",
        lineNumbers: true,
        theme: "default"
    });

    function sendMessage() {
        console.log("sendMessage function triggered"); // For debugging

        const userInput = document.getElementById("user-input").value;
        const codeInput = editor.getValue();

        if (userInput.trim() === "" && codeInput.trim() === "") return;

        addMessageToChat(userInput, 'user');

        const movingImage = document.querySelector('.moving-image');
        if (movingImage) {
            movingImage.src = "https://i.gifer.com/9fxG.gif";
            movingImage.classList.add('animate');
        }

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput, code: codeInput }),
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

        document.getElementById("user-input").value = ""; 

        setTimeout(() => {
            if (movingImage) {
                movingImage.classList.remove('animate');
                movingImage.src = "https://i.gifer.com/9fxG.gif";
            }
        }, 3000); 
    }

    function addMessageToChat(message, sender) {
        const chatContainer = document.getElementById("chat-container");
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);
        messageElement.textContent = message;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Event listener for Enter key
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener for Send button
    document.getElementById("send-button").addEventListener("click", sendMessage); // Placed outside the function
});
