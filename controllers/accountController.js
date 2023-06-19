const bcrypt = require("bcrypt");
const User = require("../models/userModel");

function renderLoginPage(req, res) {
  res.render("login", { title: "login", bodyClass: "inlogbody" });
}

async function handleLogin(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render("login", {
      error: "Invalid username or password.",
      bodyClass: "error-body",
    });
  }

  req.session.username = username;

  const loggedInUrl = "/match";
  return res.redirect(loggedInUrl);
}

function renderSignupPage(req, res) {
  res.render("signup", { title: "Signup", bodyClass: "signup-body" });
}

async function handleSignup(req, res) {
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

  const loggedInUrl = "/match";
  return res.redirect(loggedInUrl);
}

function handleLogout(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
}

async function handleDeleteAccount(req, res) {
  const { username } = req.session;

  await User.deleteOne({ username });

  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
}

module.exports = {
  renderLoginPage,
  handleLogin,
  renderSignupPage,
  handleSignup,
  handleLogout,
  handleDeleteAccount,
};
