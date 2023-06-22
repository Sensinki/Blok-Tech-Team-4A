/* eslint-disable indent */
const xss = require("xss");
const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { getUnreadMessageCount } = require("../helpers/chatHelper");
const Message = require("../models/messageModel");

// Define an array of games
const games = [
    {
        name: "Valorant",
        image: "static/images/valorant.jpg",
        liked: false,
    },
    {
        name: "Minecraft",
        image: "static/images/minecraft.jpeg",
        liked: true,
    },
    {
        name: "Super Mario Bros",
        image: "static/images/mario.jpg",
        liked: true,
    },
    {
        name: "League of Legends",
        image: "static/images/lol.jpeg",
        liked: true,
    },
    {
        name: "Call of Duty",
        image: "static/images/cod.jpeg",
        liked: true,
    },
    {
        name: "PUBG",
        image: "static/images/pubg.jpeg",
        liked: false,
    },
    {
        name: "Overwatch 2",
        image: "static/images/overwatch.jpeg",
        liked: false,
    },
    {
        name: "Counter-Strike",
        image: "static/images/csgo.webp",
        liked: false,
    },
    {
        name: "Rocket League",
        image: "static/images/rocket.webp",
        liked: false,
    },
    {
        name: "Roblox",
        image: "static/images/roblox.jpeg",
        liked: false,
    },
];
// Filter the liked games from the array
const likedGames = games.filter((game) => game.liked);

// Create an array of chats based on the liked games
const chats = likedGames.map((game) => {
    return {
        chatName: game.name,
        profilePicture: game.image,
        newMessageCount: 0,
        lastMessage: "",
    };
});

module.exports = chats;

// Controller function for rendering the home page
const home = async (req, res) => {
    const username = req.session.username || "";
    console.log("Huidige gebruikersnaam:", username);

    // Update the new message count for each chat
    const updatedChats = await Promise.all(
        chats.map(async (chat) => {
            const unreadMessageCount = await getUnreadMessageCount(chat.chatName, username);
            return { ...chat, newMessageCount: unreadMessageCount };
        })
    );

    return res.render("home", {
        username: username,
        chats: updatedChats,
        title: "Homepage",
    });
};

// Controller function for rendering a chat page
const getChat = async (req, res) => {
    const username = req.session.username || "";
    const chatName = req.params.chatName;
    const chat = chats.find((c) => c.chatName === chatName);

    // Update the read status of unread messages
    await Message.updateMany({ chatName, sender: { $ne: username }, read: false }, { $set: { read: true } });

    // Update the new message count for the current chat
    const updatedChats = chats.map((chat) => {
        if (chat.chatName === chatName) {
            return { ...chat, newMessageCount: 0 };
        } else {
            return chat;
        }
    });

    return res.render("chat", {
        messages: [],
        username: username,
        chatName: chatName,
        chats: updatedChats,
        profilePicture: chat ? chat.profilePicture : "",
    });
};

// Controller function for handling the post request to send a message
const postMessage = async (req, res) => {
    const chatName = req.params.chatName;
    const sender = req.session.username;
    const messageContent = xss(req.body.message);

    const message = new Message({
        chatName,
        sender,
        content: messageContent,
        read: false,
    });
    await message.save();

    // Emit the message event to the chat room
    io.to(chatName).emit("message", {
        chatName,
        sender,
        content: messageContent,
    });

    return res.redirect(`/chat/${chatName}`);
};

module.exports = {
    home: home,
    getChat: getChat,
    postMessage: postMessage,
};
