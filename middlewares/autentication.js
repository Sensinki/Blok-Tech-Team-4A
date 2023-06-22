/* eslint-disable indent */
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const { API_KEY } = process.env;

// Serve static files
app.use("/static", express.static("static"));
app.use(express.static("build"));
app.use("/js", express.static("build/js"));

// Set up handlebars as the template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// API endpoint to retrieve the API key
app.get("/api/api-key", (req, res) => {
    res.json({ apiKey: API_KEY });
});

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Configure session and cookie handling
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const sessionMiddleware = session({
    secret: "geheim-woord",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});
app.use(sessionMiddleware);

// Middleware to check if the user is logged in
const checkSession = (req, res, next) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    next();
};

// Export sessionMiddleware and checkSession middleware
module.exports = { sessionMiddleware, checkSession };
