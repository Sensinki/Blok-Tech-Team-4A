require("dotenv").config();
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const xss = require("xss");

const { MONGO_URI, API_KEY } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

const chats = require("./public/js/home");

const messageSchema = new mongoose.Schema({
  chatName: String,
  sender: String,
  content: String,
  isGif: Boolean,
  read: Boolean,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

app.use("/static", express.static("static"));
app.use(express.static("public"));
app.use("/js", express.static("public/js"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/api/api-key", (req, res) => {
  res.json({ apiKey: API_KEY });
});

app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);

const checkSession = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};

app.use(cookieParser());

const sessionMiddleware = session({
  secret: "geheim-woord",
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore(),
  cookie: { secure: false },
});
app.use(sessionMiddleware);

app.get("/login", function (req, res) {
  res.render("login", { title: "login", bodyClass: "inlogbody" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", {
      error: "Invalid username or password.",
      bodyClass: "error-body",
    });
  }

  req.session.username = username;

  const loggedInUrl = "/";
  return res.redirect(loggedInUrl);
});

app.get("/signup", function (req, res) {
  res.render("signup", { title: "Signup", bodyClass: "signup-body" });
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("signup", {
      error: "Email already exists.",
      title: "Signup",
      bodyClass: "signup-body",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashedPassword,
    email,
  });

  req.session.username = username;

  const loggedInUrl = "/";
  return res.redirect(loggedInUrl);
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

app.get("/delete-account", async function (req, res) {
  const { username } = req.session;

  await User.deleteOne({ username });

  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

app.get("/", checkSession, async function (req, res) {
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
});

app.get("/chat/:chatName", checkSession, async (req, res) => {
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
});

app.post("/chat/:chatName/message", checkSession, async (req, res) => {
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
});

app.use(function (req, res) {
  res.status(404).render("404", { title: "404 Not Found :(" });
});

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

run();
http.listen(PORT, () => {
  console.log(`Server gestart op poort ${PORT}`);
});
