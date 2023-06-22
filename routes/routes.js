/* eslint-disable indent */
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const chatController = require("../controllers/chatController");
const matchController = require("../controllers/matchController");
const errorController = require("../controllers/errorController");
const { checkSession } = require("../controllers/sessionControl");
const likeController = require("../controllers/likeController");

// Account Routes

// Route for displaying the login page
router.get("/login", (req, res) => {
    console.log("inside login");
    accountController.getLoginPage(req, res);
});

// Route for handling login form submission
router.post("/login", (req, res) => {
    console.log("inside login");
    accountController.login(req, res);
});

// Route for displaying the signup page
router.get("/signup", (req, res) => {
    console.log("inside signup");
    accountController.getSignupPage(req, res);
});

// Route for handling signup form submission
router.post("/signup", (req, res) => {
    console.log("inside signup");
    accountController.signup(req, res);
});

// Route for logging out
router.get("/logout", checkSession, (req, res) => {
    console.log("inside logout");
    accountController.logout(req, res);
});

// Route for deleting the account
router.get("/delete-account", checkSession, (req, res) => {
    console.log("inside delete account");
    accountController.deleteAccount(req, res);
});

// Match Routes

// Route for displaying the match page
router.get("/match", checkSession, (req, res) => {
    console.log("inside match");
    matchController.match(req, res);
});

// Like Routes

// Route for displaying the match page
router.get("/like", checkSession, (req, res) => {
    console.log("inside like");
    likeController.getLikePage(req, res);
});

// Chat Routes

// Route for displaying the home page
router.get("/", checkSession, (req, res) => {
    console.log("inside home");
    chatController.home(req, res);
});

// Route for displaying a specific chat page
router.get("/chat/:chatName", checkSession, (req, res) => {
    console.log("inside getChat");
    chatController.getChat(req, res);
});

// Route for posting a message to a chat
router.post("/chat/:chatName/message", checkSession, (req, res) => {
    console.log("inside postMessage");
    chatController.postMessage(req, res);
});

// Error Handling

// Route for handling 404 errors
router.use((req, res) => {
    console.log("inside handle404");
    errorController.handle404Error(req, res);
});

module.exports = router;
