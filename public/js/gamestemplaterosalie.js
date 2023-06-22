// Gegevens
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

// Exporteer gegevens naar Handlebars
const templateData = {
  games: games,
};

// Exporteer Handlebars-gegevens
module.exports = templateData;
