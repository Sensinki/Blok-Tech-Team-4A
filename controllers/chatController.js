const xss = require("xss");
const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { getUnreadMessageCount } = require("../helpers/chatHelper");
const Message = require("../models/messageModel");


const games = [
  {
    name: "Valorant",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_chinese-speaking_countries_and_territories.svg",
    liked: true,
  },
  {
    name: "Minecraft",
    image:
      "https://plainlanguagenetwork.org/wp-content/uploads/2017/05/banderashispanas-200.jpg",
    liked: true,
  },
  {
    name: "Super Mario Bros",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Greece_and_Cyprus.svg",
    liked: true,
  },
  {
    name: "League of Legends",
    image: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg",
    liked: false,
  },
  {
    name: "Call of Duty",
    image:
      "https://cdn-eu.purposegames.com/images/game/bg/96/ZYdKhTOijhE.png?s=1400",
    liked: false,
  },
  {
    name: "PlayerUnknown's Battlegrounds",
    image:
      "https://plainlanguagenetwork.org/wp-content/uploads/2017/07/Portuguese_Speaking_Country_Flags.png",
    liked: false,
  },
  {
    name: "Overwatch 2",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Bhutan.svg",
    liked: false,
  },
  {
    name: "Counter-Strike: Global Offensive",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
  {
    name: "Rocket League",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
  {
    name: "Roblox",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d6/Russian_language_flag.svg",
    liked: false,
  },
];
const likedGames = games.filter((game) => game.liked);

const chats = likedGames.map((game) => {
  return {
    chatName: game.name,
    profilePicture: game.image,
    newMessageCount: 0,
    lastMessage: "",
  };
});

module.exports = chats;


const home = async (req, res) => {
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

  return res.render("home", {
    username: username,
    chats: updatedChats,
    title: "Homepage",
  });
};

const getChat = async (req, res) => {
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

  return res.render("chat", {
    messages: [],
    username: username,
    chatName: chatName,
    chats: updatedChats,
    profilePicture: chat ? chat.profilePicture : "",
  });
};

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
