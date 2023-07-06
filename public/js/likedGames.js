/* eslint-disable indent */
// Games data
const games = [
    { id: "Minecraft", name: "Minecraft" },
    { id: "MarioBros", name: "Mario Bros" },
    { id: "LeagueOfLegends", name: "League of Legends" },
    { id: "CallOfDuty", name: "Call of Duty" },
    { id: "PUBG", name: "PlayerUnknown's Battlegrounds" },
    { id: "Overwatch2", name: "Overwatch 2" },
    { id: "CSGO", name: "CSGO" },
    { id: "RocketLeague", name: "Rocket League" },
    { id: "Roblox", name: "Roblox" },
    { id: "Valorant", name: "Valorant"},
];

// Export data to Handlebars
const templateData = {
    games: games,
};

// Export Handlebars data
module.exports = templateData;
