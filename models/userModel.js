/* eslint-disable indent */

// Import the required dependencies
const mongoose = require("mongoose");

// Define a game schema using Mongoose
const GameSchema = new mongoose.Schema({
    name: String,
    image: String,
    game: String,
});

// Define a user schema using Mongoose with likedGames
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    likedGames: [GameSchema],
});

const User = mongoose.model("User", userSchema, console.log("user model loaded"));

module.exports = User;
