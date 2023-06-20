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

module.exports = User;
