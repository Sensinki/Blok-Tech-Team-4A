/* eslint-disable indent */
// Require the template data from the specified file
const templateData = require("../build/js/likedGames.min.js");

// Handler for getting the like page
const getLikePage = (req, res) => {
    // Retrieve the games from the template data
    const games = templateData.games;

    res.render("like", { games: games });
};

// Export the handler function
module.exports = {
    getLikePage,
};
