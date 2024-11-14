document.addEventListener('DOMContentLoaded', () => {
    const editor = CodeMirror(document.getElementById("editor"), {
        mode: "python", // Set to Python mode
        lineNumbers: true,
        theme: "default"
    });

    const movingImage = document.getElementById("moving-image");
    const outputContainer = document.getElementById("output-container");

    // Function to switch to GIF
    function switchToGif() {
        movingImage.src = "https://i.gifer.com/9fxG.gif"; // Change to GIF URL
    }

    // Function to switch back to static image
    function switchToStatic() {
        movingImage.src = "https://i.imgur.com/wglVwlO.gif"; // Change to static image
    }

    // Function to send message or code
    function sendMessage(isCode = false) {
        console.log("sendMessage function triggered");

        const userInput = document.getElementById("user-input").value;
        const codeInput = editor.getValue();

        const messageContent = isCode ? codeInput : userInput;
        if (messageContent.trim() === "") return;

        addMessageToChat(messageContent, 'user', isCode);

        const payload = {
            message: isCode ? '' : userInput,
            code: isCode ? codeInput : ''
        };

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            switchToGif();  // Show GIF while processing

            if (data.response) {
                addMessageToChat(data.response, 'bot');
            } else if (data.error) {
                addMessageToChat("Error: " + data.error, 'bot');
            }

            // If code was run, show the output in the output-container
            if (data.output) {
                displayCodeOutput(data.output);
            }

            setTimeout(switchToStatic, 3000); // Switch back to static image after a delay
        })
        .catch(error => console.error('Error:', error));

        if (!isCode) document.getElementById("user-input").value = "";
    }

    // Add message to the chat
    function addMessageToChat(message, sender, isCode = false) {
        const chatContainer = document.getElementById("chat-container");
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);

        if (isCode) {
            messageElement.classList.add("code-message");
            messageElement.innerHTML = `<pre>${message}</pre>`;
        } else {
            messageElement.textContent = message;
        }

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Display the code output in the output container
    function displayCodeOutput(output) {
        outputContainer.textContent = "Output:\n" + output;
    }

    // Event listeners
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") sendMessage();
    });

    document.getElementById("send-button").addEventListener("click", () => sendMessage());
    document.getElementById("send-code-button").addEventListener("click", () => sendMessage(true));
});
