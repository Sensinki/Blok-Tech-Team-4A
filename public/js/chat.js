/* eslint-disable indent */
/* global io */
// Selecting all the DOM elements
const inputField = document.querySelector(".input-field");
const sendButton = document.querySelector(".send-button");
const chatBox = document.querySelector(".chat-box");
const fallbackMessage = document.querySelector(".fallback-message");
const searchGif = document.querySelector(".searchGif");
const gifButton = document.querySelector(".gif-button");
const gifHide = document.querySelector(".gifHide");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("input-form");
const errorMessage = document.querySelector(".error-message");
errorMessage.style.display = "none";

// Initializing and connecting the socket to the server
const socket = io();

let isSendingMessage = false;
let username;

// Prevent the default behavior of the form on submission
form.addEventListener("submit", (event) => {
    event.preventDefault();
});

// Hide the fallback message if it's not visible
if (fallbackMessage.style.display !== "none") {
    fallbackMessage.style.display = "none";
}

// Listen for the 'connect' event of the socket
socket.on("connect", () => {
    console.log("Connected to server");
});

// Listen for the 'message' event of the socket and display the message
socket.on("message", (data) => {
    displayMessage(data);
    setTimeout(scrollToBottom, 100);
});

// Listen for the 'chatHistory' event of the socket and display the chat history
socket.on("chatHistory", (chatHistory) => {
    chatHistory.forEach((message) => {
        displayMessage(message);
    });
    setTimeout(scrollToBottom, 100);
});

// Listen for the 'loggedInUser' event of the socket and store the username
socket.on("loggedInUser", (loggedInUser) => {
    username = loggedInUser;
});

// Add a click event listener to the 'sendButton'
sendButton.addEventListener("click", () => {
    sendMessage("text");
});

// Add a keyboard event listener to the 'inputField'
inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage("text");
    }
});

// Function to send a message based on the message type
function sendMessage(messageType, gifUrl = null) {
    if (isSendingMessage) {
        return; // If a message is already being sent, stop here
    }

    const messageContent = inputField.value;

    if (!messageContent.trim()) {
        return;
    }
    inputField.value = "";

    isSendingMessage = true; // Mark that a message is being sent

    if (messageType === "text") {
        socket.emit("message", { content: messageContent, isGif: false });
    } else if (messageType === "gif" && gifUrl) {
        socket.emit("message", { content: gifUrl, isGif: true });
    }

    setTimeout(() => {
        isSendingMessage = false; // Mark that the message has been processed
    }, 100);
}

// Function to display a message in the chat box
function displayMessage(message, isSocketMessage = true) {
    if (isSocketMessage && message.content.trim() === "") {
        return;
    }

    const newChatBubble = document.createElement("div");
    newChatBubble.classList.add("chat-bubble");
    newChatBubble.classList.add(getMessageClass(message.sender));

    const usernameElement = document.createElement("p");
    usernameElement.classList.add(addUsername(message.sender));
    usernameElement.textContent = `${message.sender} - ${getFormattedTimestamp(message.timestamp)}`;
    chatBox.appendChild(usernameElement);

    if (message.isGif) {
        const gifElement = document.createElement("img");
        gifElement.src = message.content;

        if (isSocketMessage) {
            gifElement.classList.add("sent-gif");
        }

        gifElement.setAttribute("data-gif", message.content);
        gifElement.addEventListener("click", function () {
            if (!this.classList.contains("sent-gif")) {
                const gifUrl = this.getAttribute("data-gif");
                sendGifMessage(gifUrl);
                closeGifMenu();
            }
        });

        newChatBubble.appendChild(gifElement);
    } else {
        newChatBubble.textContent = message.content;
    }

    chatBox.appendChild(newChatBubble);
}

// Function to determine the CSS class for the chat bubble based on the sender
function getMessageClass(sender) {
    if (sender === username) {
        return "right-bubble";
    } else {
        return "left-bubble";
    }
}

// Function to determine the CSS class for the username based on the sender
function addUsername(sender) {
    if (sender === username) {
        return "username-me";
    } else {
        return "username";
    }
}

// Function to format the timestamp
function getFormattedTimestamp(timestamp) {
    //https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript/46970951#46970951
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Function to scroll to the bottom of the chat box
function scrollToBottom() {
    const lastChatBubble = chatBox.lastElementChild;
    if (lastChatBubble) {
        lastChatBubble.scrollIntoView({ behavior: "smooth" });
    }
}

// Function to fetch and display GIFs
function getGifs() {
    fetch("/api/api-key")
        .then((response) => response.json())
        .then((data) => {
            const apiKey = data.apiKey;

            const searchTerm = document.getElementById("searchInput").value;
            const apiUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=" + apiKey + "&limit20";

            // HTTP request to the Giphy API using fetch
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const gifContainer = document.getElementById("gifContainer");
                    gifContainer.innerHTML = ""; // Remove any previous GIFs

                    // Check if any GIFs are found
                    if (data.data.length === 0) {
                        errorMessage.style.display = "block"; // Show the error message
                    } else {
                        errorMessage.style.display = "none"; // Hide the error message
                    }

                    // Iterate through the results and add GIFs to the page
                    for (let i = 0; i < data.data.length; i++) {
                        const gifUrl = data.data[i].images.fixed_width.url;
                        const gifElement = document.createElement("img");
                        gifElement.src = gifUrl;
                        gifElement.setAttribute("data-gif", gifUrl);
                        gifElement.addEventListener("click", function () {
                            const gifUrl = this.getAttribute("data-gif");
                            sendGifMessage(gifUrl);
                        });
                        gifContainer.appendChild(gifElement);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log("Fout bij het ophalen van de API_KEY:", error);
        });
}

// Function to send a GIF message
function sendGifMessage(gifUrl) {
    socket.emit("message", { content: gifUrl, isGif: true });
    closeGifMenu();
    gifHide.classList.remove("showInput");
    searchInput.classList.remove("active");
    searchGif.classList.remove("active");
    searchInput.value = "";
}

// Function to close the GIF menu
function closeGifMenu() {
    const gifContainer = document.getElementById("gifContainer");
    gifContainer.innerHTML = "";
}

// Function to show/hide the GIF bar
const gifBar = () => {
    if (getComputedStyle(gifHide).display === "none") {
        gifHide.classList.add("showInput");
    } else {
        gifHide.classList.remove("showInput");
    }
};
gifButton.addEventListener("click", gifBar);

// Add a click event listener to the 'searchGif' element
searchGif.addEventListener("click", () => {
    // Find the element with the ID 'searchInput'

    // Add the class 'active' to the 'searchInput' element
    searchInput.classList.add("active");

    // Add the class 'active' to the 'searchGif' element
    searchGif.classList.add("active");
});

searchGif.addEventListener("click", () => {
    getGifs();
});
