// Vereiste modules importeren
require("dotenv").config(); // Laadt de omgevingsvariabelen uit het .env-bestand
const express = require("express");
const app = express();
const { engine } = require("express-handlebars"); // View-engine voor het renderen van handlebars-templates
const { MongoClient } = require("mongodb"); // MongoDB-client voor database-interactie

// Omgevingsvariabelen ophalen
const { MONGO_URI, API_KEY, API_CAPTCHA } = process.env;

// MongoDB-client initialiseren
const client = new MongoClient(MONGO_URI);

// HTTP-server initialiseren
const http = require("http").createServer(app);

// Socket.IO initialiseren voor real-time communicatie
const io = require("socket.io")(http);

// Poortconfiguratie
const PORT = process.env.PORT || 3000;

// Chats importeren
const chats = require("./public/js/home");

// MongoDB-database en -collectie instellen
const database = client.db("chatlingo");
const messagesCollection = database.collection("messages");

// Vereiste modules importeren
const bcrypt = require("bcrypt"); // Voor het hashen en vergelijken van wachtwoorden
const xss = require("xss"); // Voor het beveiligen van invoer tegen cross-site scripting (XSS) aanvallen

// Sessieconfiguratie
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MemoryStore = require("memorystore")(session);

// Middleware voor het controlferen van de sessie
const checkSession = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
};

// Statische bestanden en handlebars-engine instellen
app.use("/static", express.static("static"));
app.use(express.static("public"));
app.use("/js", express.static("public/js"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/api/api-key", (req, res) => {
  res.json({ apiKey: API_KEY });
});

// Middleware voor het parseren van formuliergegevens en cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessiemiddleware instellen
const sessionMiddleware = session({
  secret: "geheim-woord", // Geheime sleutel voor sessie-encryptie
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore(), // Sessie-opslag in het geheugen
  cookie: { secure: false },
});
app.use(sessionMiddleware);

// Inlogpagina weergeven
app.get("/login", function (req, res) {
  res.render("login", { title: "login", bodyClass: "inlogbody" });
});

// Inloggegevens controleren
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verbinding maken met de MongoDB-database
  await client.connect();
  const database = client.db("chatlingo");
  const usersCollection = database.collection("users");

  // Gebruiker opzoeken in de database
  const user = await usersCollection.findOne({ username });

  // Controleren of gebruiker bestaat en wachtwoord overeenkomt
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Ongeldige gebruikersnaam of wachtwoord
    return res.render("login", {
      error: "Invalid username or password.",
      bodyClass: "error-body",
    });
  }

  // Sessie instellen voor de ingelogde gebruiker
  req.session.username = username;

  const loggedInUrl = "/";
  return res.redirect(loggedInUrl);
});

app.get("/signup", function (req, res) {
  res.render("signup", { title: "Signup", bodyClass: "signup-body" });
});

// Aanmeldingsgegevens verwerken
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  // Verbinding maken met de MongoDB-database
  await client.connect();
  const database = client.db("chatlingo");
  const usersCollection = database.collection("users");

  // Controleren of de gebruikersnaam al bestaat
  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) {
    return res.render("signup", {
      error: "Username already exists.",
      title: "Signup",
      bodyClass: "signup-body",
    });
  }

  // Het wachtwoord hashen met bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Nieuwe gebruiker toevoegen aan de database
  await usersCollection.insertOne({
    username,
    password: hashedPassword,
    email,
  });

  // Sessie instellen voor de aangemelde gebruiker
  req.session.username = username;

  const loggedInUrl = "/";
  return res.redirect(loggedInUrl);
});

// Uitloggen
app.get("/logout", function (req, res) {
  // Sessie vernietigen en gebruiker uitloggen
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

// Account verwijderen
app.get("/delete-account", async function (req, res) {
  const { username } = req.session;

  // Verbinding maken met de MongoDB-database
  await client.connect();
  const database = client.db("chatlingo");
  const usersCollection = database.collection("users");

  // Gebruiker verwijderen uit de database
  await usersCollection.deleteOne({ username });

  // Sessie vernietigen en gebruiker uitloggen
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

// Homepage weergeven
app.get("/", checkSession, async function (req, res) {
  const username = req.session.username || "";
  console.log("Huidige gebruikersnaam:", username);

  // Aantal ongelezen berichten ophalen voor elke chat
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

// Chatpagina weergeven
app.get("/chat/:chatName", checkSession, async (req, res) => {
  const username = req.session.username || "";
  const chatName = req.params.chatName;
  const chat = chats.find((c) => c.chatName === chatName);

  // Alle ongelezen berichten in de huidige chat markeren als gelezen
  await messagesCollection.updateMany(
    { chatName, sender: { $ne: username }, read: false },
    { $set: { read: true } }
  );

  // Aantal nieuwe berichten in de chat op nul zetten
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
    profilePicture: chat ? chat.profilePicture : "", // Controleer of chat gedefinieerd is
  });
});

// Nieuw bericht verzenden in de chat
app.post("/chat/:chatName/message", checkSession, async (req, res) => {
  const chatName = req.params.chatName;
  const sender = req.session.username;
  const messageContent = xss(req.body.message);

  // Nieuw bericht toevoegen aan de MongoDB-database
  await messagesCollection.insertOne({
    chatName,
    sender,
    content: messageContent,
    read: false,
  });

  // Bericht verzenden naar alle gebruikers in de chat via Socket.IO
  io.to(chatName).emit("message", {
    chatName,
    sender,
    content: messageContent,
  });

  res.redirect(`/chat/${chatName}`);
});

// 404-pagina weergeven voor onbekende routes
app.use(function (req, res) {
  res.status(404).render("404", { title: "404 Not Found :(" });
});

// Functie om het aantal ongelezen berichten op te halen
async function getUnreadMessageCount(chatName, loggedInUser) {
  const unreadMessages = await messagesCollection.countDocuments({
    chatName,
    sender: { $ne: loggedInUser },
    read: false,
  });
  return unreadMessages;
}

// Start de server en Socket.IO-verbinding
async function run() {
  try {
    await client.connect();

    console.log("MONGODB IS HIER YUH :)");

    // Middleware voor het delen van sessies met Socket.IO
    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    });

    // Socket.IO verbinding
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

      // Chatgeschiedenis ophalen en naar de client sturen
      const chatHistory = await messagesCollection.find({ chatName }).toArray();
      socket.emit("chatHistory", chatHistory);

      // Nieuw bericht ontvangen van de client
      socket.on("message", async (msg) => {
        const sender = socket.request.session.username;
        const timestamp = Date.now();
        await messagesCollection.insertOne({
          ...msg,
          chatName,
          sender,
          timestamp,
          read: false,
        });

        // Bericht verzenden naar alle gebruikers in de chat via Socket.IO
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

// Server starten en luisteren naar inkomende verzoeken
run();
http.listen(PORT, () => {
  console.log(`Server gestart op poort ${PORT}`);
});
