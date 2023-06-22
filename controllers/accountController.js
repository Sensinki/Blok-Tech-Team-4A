const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getLoginPage = (req, res) => {
  return res.render("login", { title: "login", bodyClass: "inlogbody" });
};

const login = async (req, res) => {
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
};

const getSignupPage = (req, res) => {
  return res.render("signup", { title: "Signup", bodyClass: "signup-body" });
};

const signup = async (req, res) => {
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
};

const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    return res.redirect("/login");
  });
};

const deleteAccount = async (req, res) => {
  const { username } = req.session;

  await User.deleteOne({ username });

  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    return res.redirect("/login");
  });
};

module.exports = {
  getLoginPage,
  login,
  getSignupPage,
  signup,
  logout,
  deleteAccount,
};