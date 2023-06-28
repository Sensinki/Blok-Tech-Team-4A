/* eslint-disable indent */
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { API_CAPTCHA } = process.env;

// Handler for rendering the login page
const getLoginPage = (req, res) => {
    return res.render("login", { title: "login", bodyClass: "inlogbody" });
};

const login = async (req, res) => {
    const { username, password, "g-recaptcha-response": recaptchaResponse } = req.body;

    // Verify reCAPTCHA
    const secretKey = API_CAPTCHA;
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    const remoteIP = req.connection.remoteAddress;

    try {
        const response = await axios.post(verificationUrl, null, {
            params: {
                secret: secretKey,
                response: recaptchaResponse,
                remoteip: remoteIP,
            },
        });

        const { success } = response.data;

        if (success) {
            // reCAPTCHA verification succeeded, continue with login logic

            // Find the user in the database based on the provided username
            const user = await User.findOne({ username });

            // Check if the user exists and compare the provided password with the hashed password
            if (!user || !(await bcrypt.compare(password, user.password))) {
                // Render the login page with an error message if the credentials are invalid
                return res.render("login", {
                    error: "Invalid username or password.",
                    bodyClass: "error-body",
                });
            }

            // Set the username in the session to indicate that the user is logged in
            req.session.username = username;

            const loggedInUrl = "/match";
            // Redirect the user to the logged-in URL
            return res.redirect(loggedInUrl);
        } else {
            // reCAPTCHA verification failed
            return res.render("login", {
                error: "reCAPTCHA verification failed. Please try again.",
                bodyClass: "error-body",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error occurred while verifying reCAPTCHA.");
    }
};

// Handler for rendering the signup page
const getSignupPage = (req, res) => {
    return res.render("signup", { title: "Signup", bodyClass: "signup-body" });
};

// Handler for processing the signup request
const signup = async (req, res) => {
    const { username, password, email } = req.body;

    // Check if an existing user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // Render the signup page with an error message if the email is already taken
        return res.render("signup", {
            error: "Email already exists.",
            title: "Signup",
            bodyClass: "signup-body",
        });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided username, hashed password, and email
    await User.create({
        username,
        password: hashedPassword,
        email,
    });

    // Set the username in the session to indicate that the user is logged in
    req.session.username = username;

    const loggedInUrl = "/match";
    // Redirect the user to the logged-in URL
    return res.redirect(loggedInUrl);
};

// Handler for logging out the user
const logout = (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        // Redirect the user to the login page
        return res.redirect("/login");
    });
};

// Handler for deleting the user account
const deleteAccount = async (req, res) => {
    const { username } = req.session;

    // Delete the user account from the database
    await User.deleteOne({ username });

    // Destroy the session to log out the user
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        // Redirect the user to the login page
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
