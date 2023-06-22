// server.js

require("dotenv").config();
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");
const { socketLogic } = require("./helpers/chatHelper.js");


const { MONGO_URI, API_KEY } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use("/static", express.static("static"));
app.use(express.static("build"));
app.use("/js", express.static("build/js"));
app.use(express.static("public"));
app.use("/js", express.static("public/js"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/api/api-key", (req, res) => {
  res.json({ apiKey: API_KEY });
});

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const sessionMiddleware = session({
  secret: "geefeen10:)bweuSnwedfuwebWfuc`Jkl§wwenfweimfwei1fhwoeifjieowfj",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

// Register routes
app.use("/", routes);


socketLogic(io, sessionMiddleware);


http.listen(PORT, () => {
  console.log(`Server gestart op poort ${PORT}`);
});
