/* global io */
// Hier worden alle DOM-elementen geselecteerd.
const inputField = document.querySelector(".input-field");
const sendButton = document.querySelector(".send-button");
const chatBox = document.querySelector(".chat-box");
const fallbackMessage = document.querySelector(".fallback-message");
const searchGif = document.querySelector(".searchGif");
const gifButton = document.querySelector(".gif-button");
const gifHide = document.querySelector(".gifHide");
const searchInput = document.getElementById("searchInput");
const form = document.getElementById("input-form");

// De "socket" wordt geïnitialiseerd en verbonden met de server.
const socket = io();

let isSendingMessage = false;
let username;

// Voorkom het standaardgedrag van het formulier bij het indienen.
form.addEventListener("submit", (event) => {
  event.preventDefault();
});

// Verberg het fallback-bericht als het niet zichtbaar is.
if (fallbackMessage.style.display !== "none") {
  fallbackMessage.style.display = "none";
}

// Luister naar het 'connect'-evenement van de socket.
socket.on("connect", () => {
  console.log("Connected to server");
});

// Luister naar het 'message'-evenement van de socket en geef het bericht weer.
socket.on("message", (data) => {
  displayMessage(data);
  setTimeout(scrollToBottom, 100);
});

// Luister naar het 'chatHistory'-evenement van de socket en geef de chatgeschiedenis weer.
socket.on("chatHistory", (chatHistory) => {
  chatHistory.forEach((message) => {
    displayMessage(message);
  });
  setTimeout(scrollToBottom, 100);
});

// Luister naar het 'loggedInUser'-evenement van de socket en bewaar de gebruikersnaam.
socket.on("loggedInUser", (loggedInUser) => {
  username = loggedInUser;
});

// Voeg een klikgebeurtenisluisteraar toe aan de 'sendButton'.
sendButton.addEventListener("click", () => {
  sendMessage("text");
});

// Voeg een toetsenbordgebeurtenisluisteraar toe aan het 'inputField'.
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage("text");
  }
});

// Functie om een bericht te verzenden, afhankelijk van het berichttype.
function sendMessage(messageType, gifUrl = null) {
  if (isSendingMessage) {
    return; // Als er al een bericht wordt verzonden, stop dan hier
  }

  const messageContent = inputField.value;

  if (!messageContent.trim()) {
    return;
  }
  inputField.value = "";

  isSendingMessage = true; // Markeer dat er een bericht wordt verzonden

  if (messageType === "text") {
    socket.emit("message", { content: messageContent, isGif: false });
  } else if (messageType === "gif" && gifUrl) {
    socket.emit("message", { content: gifUrl, isGif: true });
  }

  setTimeout(() => {
    isSendingMessage = false; // Markeer dat het bericht is verwerkt
  }, 100);
}

// Functie om een bericht weer te geven in de chatbox.
function displayMessage(message, isSocketMessage = true) {
  if (
    isSocketMessage &&
    (message.content.trim() === "")
  ) {
    return;
  }

  const newChatBubble = document.createElement("div");
  newChatBubble.classList.add("chat-bubble");
  newChatBubble.classList.add(getMessageClass(message.sender));

  const usernameElement = document.createElement("p");
  usernameElement.classList.add(addUsername(message.sender));
  usernameElement.textContent = `${message.sender} - ${getFormattedTimestamp(
    message.timestamp
  )}`;
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

// Functie om het CSS-klasse voor de chatbubbel te bepalen op basis van de afzender.
function getMessageClass(sender) {
  if (sender === username) {
    return "right-bubble";
  } else {
    return "left-bubble";
  }
}

// Functie om de CSS-klasse voor de gebruikersnaam te bepalen op basis van de afzender.
function addUsername(sender) {
  if (sender === username) {
    return "username-me";
  } else {
    return "username";
  }
}

// Functie om de timestamp te formatteren.
function getFormattedTimestamp(timestamp) {  //https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript/46970951#46970951
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Functie om naar beneden te scrollen in de chatbox.
function scrollToBottom() {
  const lastChatBubble = chatBox.lastElementChild;
  if (lastChatBubble) {
    lastChatBubble.scrollIntoView({ behavior: "smooth" });
  }
}

// Functie om GIFs op te halen en weer te geven.
function getGifs() {
  fetch("/api/api-key")
    .then((response) => response.json())
    .then((data) => {
      const apiKey = data.apiKey;

      const searchTerm = document.getElementById("searchInput").value;
      const apiUrl = //https://developers.giphy.com/docs/api/endpoint
        "https://api.giphy.com/v1/gifs/search?q=" +
        searchTerm +
        "&api_key=" +
        apiKey +
        "&limit20";

      // HTTP-verzoek naar de Giphy API met behulp van fetch
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const gifContainer = document.getElementById("gifContainer");
          gifContainer.innerHTML = ""; // Verwijder eventuele vorige GIFs

          // Itereer door de resultaten en voeg GIFs toe aan de pagina
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

// Functie om een GIF-bericht te verzenden.
function sendGifMessage(gifUrl) {
  socket.emit("message", { content: gifUrl, isGif: true });
  closeGifMenu();
  gifHide.classList.remove("showInput");
  searchInput.classList.remove("active");
  searchGif.classList.remove("active");
  searchInput.value = "";
}

// Functie om het GIF-menu te sluiten.
function closeGifMenu() {
  const gifContainer = document.getElementById("gifContainer");
  gifContainer.innerHTML = "";
}

// Functie om de GIF-balk te tonen/verbergen.
const gifBar = () => {
  if (getComputedStyle(gifHide).display === "none") {
    gifHide.classList.add("showInput");
  } else {
    gifHide.classList.remove("showInput");
  }
};
gifButton.addEventListener("click", gifBar);

// Voeg een klikgebeurtenisluisteraar toe aan het 'searchGif'-element
searchGif.addEventListener("click", () => {
  // Zoek het element met de ID 'searchInput'

  // Voeg de class 'active' toe aan het 'searchInput'-element
  searchInput.classList.add("active");

  // Voeg de class 'active' toe aan het 'searchGif'-element
  searchGif.classList.add("active");
});

searchGif.addEventListener("click", () => {
  getGifs();
});
