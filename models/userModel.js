/* eslint-disable indent */
const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     email: String,
//     // likedGames: [
//     //    {
//     //       "name: "Roblox",
//     //       "image": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
//     //       "liked": {false},
//     //    },
//     //    {
//     //       "name" : "",
//     //       "image" : 2
//     //    },
//     // ]
// });

const GameSchema = new mongoose.Schema({
    liked: Boolean,
    gameName: String,
    gameImage: String,
    gameCode: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    likedGames: [GameSchema],
});

const User = mongoose.model("User", userSchema, console.log("user model loaded"));

module.exports = User;
