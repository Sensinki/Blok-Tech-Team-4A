/* eslint-disable indent */
// Games data
const games = [
    { id: "Minecraft", name: "Minecraft" },
    { id: "Valorant", name: "Valorant" },
    { id: "MarioBros", name: "Mario Bros" },
    { id: "LeagueOfLegends", name: "League of Legends" },
    { id: "CallOfDuty", name: "Call of Duty" },
    { id: "PUBG", name: "PlayerUnknown's Battlegrounds" },
    { id: "Overwatch2", name: "Overwatch 2" },
    { id: "CSGO", name: "CSGO" },
    { id: "Roblox", name: "Roblox" },
    { id: "RocketLeague", name: "Rocket League" },
];

// Export data to Handlebars
const templateData = {
    games: games,
};

// Export Handlebars data
module.exports = templateData;
