/* eslint-disable indent */

// Import the required dependencies
const mongoose = require("mongoose");

// Define a game schema using Mongoose
const gameSchema = new mongoose.Schema({
    name: String,
    image: String,
    game: String,
    liked: {
        type: Boolean,
        default: true,
    },
});

const Game = mongoose.model("Game", gameSchema, console.log("game model loaded"));

module.exports = Game;
