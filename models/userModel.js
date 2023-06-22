/* eslint-disable indent */
const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    liked: Boolean,
    gameName: String,
    gameImage: String,
    gameCode: String,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    likedGames: [GameSchema],
});

const User = mongoose.model("User", userSchema, console.log("user model loaded"));

<<<<<<< HEAD
module.exports = User;
=======
module.exports = User;
>>>>>>> b5d2d4ec040cbfd181d571d465ca6837536492d3
