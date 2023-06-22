const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const chatController = require("../controllers/chatController");
const matchController = require("../controllers/matchController");
const errorController = require("../controllers/errorController");
const { checkSession } = require("../controllers/sessionControl");

// Account Routes
router.get("/login", (req, res) => {
  console.log("inside login");
  accountController.getLoginPage(req, res);
});

router.post("/login", (req, res) => {
  console.log("inside login");
  accountController.login(req, res);
});

router.get("/signup", (req, res) => {
  console.log("inside signup");
  accountController.getSignupPage(req, res);
});

router.post("/signup", (req, res) => {
  console.log("inside signup");
  accountController.signup(req, res);
});

router.get("/logout", checkSession, (req, res) => {
  console.log("inside logout");
  accountController.logout(req, res);
});

router.get("/delete-account",checkSession, (req, res) => {
  console.log("inside delete account");
  accountController.deleteAccount(req, res);
});

// Match Routes
router.get("/match", checkSession,(req, res) => {
  console.log("inside match");
  matchController.match(req, res);
});

router.post("/match", checkSession, (req, res) => {
  matchController.matchPost(req, res);
});

// Chat Routes
router.get("/", checkSession,(req, res) => {
  console.log("inside home");
  chatController.home(req, res);
});

router.get("/chat/:chatName", checkSession,(req, res) => {
  console.log("inside getChat");
  chatController.getChat(req, res);
});

router.post("/chat/:chatName/message",checkSession, (req, res) => {
  console.log("inside postMessage");
  chatController.postMessage(req, res);
});

// Error Handling
router.use((req, res) => {
  console.log("inside handle404");
  errorController.handle404Error(req, res);
});

module.exports = router;
