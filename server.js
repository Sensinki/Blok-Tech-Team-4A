/* eslint-disable indent */
// server.js

// Import dependencies
require("dotenv").config();
const express = require("express");
const app = express();
// const { engine } = require("express-handlebars");
const exphbs = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");
const { socketLogic } = require("./helpers/chatHelper.js");


// Connect to the database
const connectDB = require("./models/database");
connectDB();

// Get API_KEY from environment variables
const { API_KEY } = process.env;

// Create HTTP server and initialize Socket.IO
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use("/static", express.static("static"));
app.use(express.static("build"));
app.use("/js", express.static("build/js"));
app.use(express.static("public"));
app.use("/js", express.static("public/js"));

const hbs = exphbs.create({
    // Disable the prototype access check
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  });

  hbs.handlebars.registerHelper('getProperty', function(obj, property) {
    return obj[property];
  });

// Configure template engine
app.engine("handlebars", hbs.engine);

// app.engine("handlebars");
app.set("view engine", "handlebars");
app.set("views", "./views");

// API endpoint to retrieve the API_KEY
app.get("/api/api-key", (req, res) => {
    res.json({ apiKey: API_KEY });
});

// Parse URL-encoded bodies
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



// Parse cookies
app.use(cookieParser());

// Configure session middleware
const sessionMiddleware = session({
    secret: "geefeen10:)bweuSnwedfuwebWfuc`Jkl§wwenfweimfwei1fhwoeifjieowfj",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});
app.use(sessionMiddleware);

// Register routes
app.use("/", routes);

// Configure Socket.IO logic
socketLogic(io, sessionMiddleware);

// Start the server
http.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
});




///blablatest///////
