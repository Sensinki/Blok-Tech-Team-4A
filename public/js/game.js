/* eslint-disable indent */
// game.js

// Array of games
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

// Event listener for Like button
document.querySelector(".LikeButton").addEventListener("click", function (event) {
    event.preventDefault();
});

// Initialize current game index
let currentGameIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    const dislikeButton = document.querySelector(".DisLikeButton");
    const likeButton = document.querySelector(".LikeButton");

    dislikeButton.addEventListener("click", loadNextGame);
    likeButton.addEventListener("click", loadNextGame);

    function loadNextGame() {
        currentGameIndex++;

        // Check if reached the end of the games array
        if (currentGameIndex >= games.length) {
            currentGameIndex = 0;
            window.location.href = "/";
            return;
        }

        console.log("Current Index:", currentGameIndex);

        const currentGame = games[currentGameIndex];

        // Update the game image, name, code
        const gameImage = document.querySelector(".userimg");
        gameImage.style.backgroundImage = `url(${currentGame.image})`;

        const gameName = document.querySelector("h3");
        gameName.textContent = currentGame.name;

        const gameGame = document.querySelector("p");
        gameGame.textContent = currentGame.game;
    }

    // Event listener for Like button
    likeButton.addEventListener("click", function (event) {
        event.preventDefault();
        let liked = true;
        const currentGame = games[currentGameIndex];
        // AJAX request
        var xhr = new XMLHttpRequest();

        xhr.open("POST", "/match", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Send the data to the server
        xhr.send(
            JSON.stringify({
                liked: liked,
                gameName: currentGame.name,
                gameImage: currentGame.image,
                gameCode: currentGame.game,
            })
        );

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("succesfully sent to the server");
                } else {
                    console.error("failed");
                }
            }
        };
    });
});
