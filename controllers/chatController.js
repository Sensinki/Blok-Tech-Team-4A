const chats = require("../public/js/home");
const Message = require("../models/messageModel");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
const xss = require("xss");

async function getUnreadMessageCount(chatName, loggedInUser) {
  const unreadMessages = await Message.countDocuments({
    chatName,
    sender: { $ne: loggedInUser },
    read: false,
  });
  return unreadMessages;
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MONGODB IS HIER YUH :)");

    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    });

    io.on("connection", async (socket) => {
      const chatName = socket.handshake.headers.referer.split("/").pop();
      console.log(
        `User ${socket.request.session.username} connected in ${chatName}`
      );
      socket.join(chatName);

      if (socket.request.session && socket.request.session.username) {
        const loggedInUser = socket.request.session.username;
        console.log(`User ${loggedInUser} is ingelogd`);
        io.to(socket.id).emit("loggedInUser", loggedInUser);
      } else {
        console.log("Er is niet ingelogd");
      }

      socket.on("disconnect", () => {
        console.log(
          `User ${socket.request.session.username} disconnected from ${chatName}`
        );
      });
      const chatHistory = await Message.find({ chatName }).exec();

      socket.emit("chatHistory", chatHistory);

      socket.on("message", async (msg) => {
        const sender = socket.request.session.username;
        const timestamp = Date.now();
        const message = new Message({
          ...msg,
          chatName,
          sender,
          timestamp,
          read: false,
        });
        await message.save();

        io.to(chatName).emit("message", { ...msg, sender, timestamp });
        console.log(`Message toegevoegd aan MongoDB: ${msg.content}`);
      });
    });
  } catch (err) {
    console.log(err);
  } finally {
    // await client.close();
  }
}

async function renderHomePage(req, res) {
  const username = req.session.username || "";
  console.log("Huidige gebruikersnaam:", username);

  const updatedChats = await Promise.all(
    chats.map(async (chat) => {
      const unreadMessageCount = await getUnreadMessageCount(
        chat.chatName,
        username
      );
      return { ...chat, newMessageCount: unreadMessageCount };
    })
  );

  res.render("home", {
    username: username,
    chats: updatedChats,
    title: "Homepage",
  });
}

async function renderChatPage(req, res) {
  const username = req.session.username || "";
  const chatName = req.params.chatName;
  const chat = chats.find((c) => c.chatName === chatName);

  await Message.updateMany(
    { chatName, sender: { $ne: username }, read: false },
    { $set: { read: true } }
  );

  const updatedChats = chats.map((chat) => {
    if (chat.chatName === chatName) {
      return { ...chat, newMessageCount: 0 };
    } else {
      return chat;
    }
  });

  res.render("chat", {
    messages: [],
    username: username,
    chatName: chatName,
    chats: updatedChats,
    profilePicture: chat ? chat.profilePicture : "",
  });
}

async function handleMessagePost(req, res) {
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

  io.to(chatName).emit("message", {
    chatName,
    sender,
    content: messageContent,
  });

  res.redirect(`/chat/${chatName}`);
}

module.exports = {
  renderHomePage,
  renderChatPage,
  handleMessagePost,
  getUnreadMessageCount,
};
