/* eslint-disable indent */
// Define an array of games
const games = [
    {
        name: "Valorant",
        image: "static/images/valorant.jpg",
        liked: false,
    },
    {
        name: "Minecraft",
        image: "static/images/minecraft.jpeg",
        liked: true,
    },
    {
        name: "Super Mario Bros",
        image: "static/images/mario.jpg",
        liked: true,
    },
    {
        name: "League of Legends",
        image: "static/images/lol.jpeg",
        liked: true,
    },
    {
        name: "Call of Duty",
        image: "static/images/cod.jpeg",
        liked: true,
    },
    {
        name: "PUBG",
        image: "static/images/pubg.jpeg",
        liked: false,
    },
    {
        name: "Overwatch 2",
        image: "static/images/overwatch.jpeg",
        liked: false,
    },
    {
        name: "Counter-Strike",
        image: "static/images/csgo.webp",
        liked: false,
    },
    {
        name: "Rocket League",
        image: "static/images/rocket.webp",
        liked: false,
    },
    {
        name: "Roblox",
        image: "static/images/roblox.jpeg",
        liked: false,
    },
];

// Filter the liked games from the array
const likedGames = games.filter((game) => game.liked);

// Map the liked games to create an array of chat objects
const chats = likedGames.map((game) => {
    return {
        chatName: game.name,
        profilePicture: game.image,
        newMessageCount: 0,
        lastMessage: "",
    };
});

module.exports = chats;
