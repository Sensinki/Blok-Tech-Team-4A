/* eslint-disable indent */
const Message = require("../models/messageModel");

// Function to get the count of unread messages in a chat for a logged-in user
async function getUnreadMessageCount(chatName, loggedInUser) {
    // Count the number of unread messages
    const unreadMessages = await Message.countDocuments({
        chatName,
        sender: { $ne: loggedInUser },
        read: false,
    });
    return unreadMessages;
}

// Socket.io logic for handling socket connections
const socketLogic = (io, sessionMiddleware) => {
    io.use((socket, next) => {
        // Add session middleware to the socket
        sessionMiddleware(socket.request, {}, next);
    });

    io.on("connection", async (socket) => {
        // Extract the chatName from the URL
        const chatName = socket.handshake.headers.referer.split("/").pop();
        console.log(`User ${socket.request.session.username} connected in ${chatName}`);
        socket.join(chatName);

        // Check if a user is logged in and emit the username to the socket
        if (socket.request.session && socket.request.session.username) {
            const loggedInUser = socket.request.session.username;
            console.log(`User ${loggedInUser} is ingelogd`);
            io.to(socket.id).emit("loggedInUser", loggedInUser);
        } else {
            console.log("Er is niet ingelogd");
        }

        // Handle socket disconnect event
        socket.on("disconnect", () => {
            console.log(`User ${socket.request.session.username} disconnected from ${chatName}`);
        });

        // Retrieve chat history from MongoDB and emit it to the socket
        const chatHistory = await Message.find({ chatName }).exec();
        socket.emit("chatHistory", chatHistory);

        // Handle incoming messages
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

            // Emit the message to all sockets in the chat room
            io.to(chatName).emit("message", { ...msg, sender, timestamp });
            console.log(`Message toegevoegd aan MongoDB: ${msg.content}`);
        });
    });
};

module.exports = {
    socketLogic,
    getUnreadMessageCount,
};
