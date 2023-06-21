const express = require("express");
const app = express();
const { checkSession } = require("../middlewares/autentication");

const accountController = require("../controllers/accountController");

app.get("/login", accountController.renderLoginPage);
app.post("/login", accountController.handleLogin);
app.get("/signup", accountController.renderSignupPage);
app.post("/signup", accountController.handleSignup);
app.get("/logout", accountController.handleLogout);
app.get("/delete-account", accountController.handleDeleteAccount);

const matchController = require("../controllers/matchController");

app.get("/match", checkSession, matchController.renderMatchPage);
app.post("/match", checkSession, matchController.handleMatchPost);


const chatController = require("../controllers/chatController");

app.get("/", checkSession, chatController.renderHomePage);
app.get("/chat/:chatName", checkSession, chatController.renderChatPage);
app.post("/chat/:chatName/message", checkSession, chatController.handleMessagePost);


const errorController = require("../controllers/errorController");

app.use(errorController.handle404Error);


module.exports = app;