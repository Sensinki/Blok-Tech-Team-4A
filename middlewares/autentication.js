const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const { API_KEY } = process.env;


app.use("/static", express.static("static"));
app.use(express.static("build"));
app.use("/js", express.static("build/js"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/api/api-key", (req, res) => {
  res.json({ apiKey: API_KEY });
});

app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
const cookieParser = require("cookie-parser");

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
  cookie: { secure: false },
});
app.use(sessionMiddleware);
