/* eslint-disable indent */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    // likedGames: [
    //    {
    //       "name" : "",
    //       "image" : 2
    //     },
    //     {
    //       "name" : "",
    //       "image" : 2
    //     },
    // ]
});

const User = mongoose.model("User", userSchema, console.log("user model loaded"));

module.exports = User;
