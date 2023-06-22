/* eslint-disable indent */
const mongoose = require("mongoose");

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
