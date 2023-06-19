const Game = require("../models/gameModel");

let games = [];
let currentIndex = 0;

async function renderMatchPage(req, res) {
  try {
    const foundGames = await Game.find({});
    games = foundGames;
    if (currentIndex >= games.length) {
      res.redirect("/");
    } else {
      console.log("Current Index:", currentIndex);
      res.render("match", { game: games[currentIndex] });
      currentIndex++;
    }
  } catch (error) {
    console.error("Error retrieving games:", error);
  }
}

async function handleMatchPost(req, res) {
  const gameId = req.body.gameId;
  const like = req.body.liked === "true";

  try {
    await Game.findByIdAndUpdate(gameId, { liked: like });
    currentIndex++;

    if (currentIndex >= games.length) {
      res.redirect("/");
    } else {
      console.log("Current Index:", currentIndex);
      res.render("match", { game: games[currentIndex] });
    }
  } catch (error) {
    console.error("Error updating game:", error);
  }
}

module.exports = {
  renderMatchPage,
  handleMatchPost,
};
