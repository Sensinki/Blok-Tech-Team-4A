/* eslint-disable indent */

// Import the required dependencies
const mongoose = require("mongoose");

// Define a message schema using Mongoose
const messageSchema = new mongoose.Schema({
    chatName: String,
    sender: String,
    content: String,
    isGif: Boolean,
    read: Boolean,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema, console.log("message model loaded"));

module.exports = Message;
