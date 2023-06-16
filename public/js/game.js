// game.js
const games = [
  {
    name: "Valorant",
    image: "../static/images/valorant.jpeg",
    game: "VAL",
  },
  {
    name: "Minecraft",
    image: "../static/images/minecraft.jpeg",
    game: "MC",
  },
  {
    name: "Super Mario Bros",
    image: "static/images/lol.jpeg",
    game: "SMB",
  },
  {
    name: "League of Legend",
    image: "static/images/lol.jpeg",
    game: "LOL",
  },
  {
    name: "Call of Duty",
    image: "static/images/lol.jpeg",
    game: "COD",
  },
  {
    name: "PlayerUnknown's Battlegrounds",
    image: "static/images/lol.jpeg",
    game: "PUBG",
  },
  {
    name: "Overwatch 2",
    image: "static/images/lol.jpeg",
    game: "OW2",
  },
  {
    name: "Counter-Strike: Global Offensive",
    image: "static/images/lol.jpeg",
    game: "CSGO",
  },
  {
    name: "Rocket League",
    image: "static/images/lol.jpeg",
    game: "RL",
  },
  {
    name: "Roblox",
    image: "static/images/lol.jpeg",
    game: "Roblox",
  },
];



document
  .querySelector(".LikeButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
  });

let currentGameIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const dislikeButton = document.querySelector(".DisLikeButton");
  const likeButton = document.querySelector(".LikeButton");

  dislikeButton.addEventListener("click", loadNextGame);
  likeButton.addEventListener("click", loadNextGame);

  function loadNextGame() {
    currentGameIndex++;
    if (currentGameIndex >= games.length) {
      currentGameIndex = 0;
      window.location.href = "/";
      return;
    }

    console.log("Current Index:", currentGameIndex);

    const currentGame = games[currentGameIndex];

    const gameImage = document.querySelector(".userimg");
    gameImage.style.backgroundImage = `url(${currentGame.image})`;

    const gameName = document.querySelector("h3");
    gameName.textContent = currentGame.name;

    const gameGame = document.querySelector("p");
    gameGame.textContent = currentGame.game;
  }
  likeButton.addEventListener("click", function (event) {
    event.preventDefault();

    let liked;
    // Update de like-status
    liked = true;

    // Maak een AJAX-verzoek naar de server om de like-status door te geven
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/match", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Stuur de like-status als JSON naar de server
    xhr.send(JSON.stringify({ liked: liked }));

    // Verwerk het antwoord van de server indien nodig
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Het verzoek is succesvol verwerkt
          console.log("Like-status succesvol naar de server verzonden");
        } else {
          // Er is een fout opgetreden bij het verwerken van het verzoek
          console.error(
            "Fout bij het verzenden van de like-status naar de server"
          );
        }
      }
    };
  });
});
