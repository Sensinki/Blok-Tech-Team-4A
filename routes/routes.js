const express = require("express");
const app = express();
// const { engine } = require("express-handlebars");


app.get("/login", function (req, res) {
});

app.post("/login", async (req, res) => {
});

app.get("/signup", function (req, res) {
 
});

app.post("/signup", async (req, res) => {
 
});

app.get("/logout", function (req, res) {
 
});

app.get("/delete-account", async function (req, res) {
 
});

app.get("/match", checkSession, match);

function match(req, res) {
 
}

app.post("/match", async (req, res) => {
 
});

app.get("/", checkSession, async function (req, res) {
 
});

app.get("/chat/:chatName", checkSession, async (req, res) => {
 
});

app.post("/chat/:chatName/message", checkSession, async (req, res) => {
 
});

app.use(function (req, res) {
 
});




const accountController = require('../controllers/accountController');

app.get("/login", accountController.renderLoginPage);
app.post("/login", accountController.handleLogin);
app.get("/signup", accountController.renderSignupPage);
app.post("/signup", accountController.handleSignup);
app.get("/logout", accountController.handleLogout);
app.get("/delete-account", accountController.handleDeleteAccount);

const matchController = require('../controllers/matchController');

app.get("/match", checkSession, matchController.renderMatchPage);
app.post("/match", checkSession, matchController.handleMatchPost);

// ...


const chatController = require('./controllers/chatController');

app.get("/", checkSession, chatController.renderHomePage);
app.get("/chat/:chatName", checkSession, chatController.renderChatPage);
app.post("/chat/:chatName/message", checkSession, chatController.handleMessagePost);


const errorController = require("./controllers/errorController");

app.use(errorController.handle404Error);
