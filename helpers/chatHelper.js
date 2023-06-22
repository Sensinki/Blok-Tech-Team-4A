const Message = require("../models/messageModel");

async function getUnreadMessageCount(chatName, loggedInUser) {
  const unreadMessages = await Message.countDocuments({
    chatName,
    sender: { $ne: loggedInUser },
    read: false,
  });
  return unreadMessages;
}

const socketLogic = (io, sessionMiddleware) => {
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
};

module.exports = {
  socketLogic,
  getUnreadMessageCount,
};
