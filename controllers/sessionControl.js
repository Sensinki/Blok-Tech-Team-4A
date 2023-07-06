/* eslint-disable indent */

// Middleware to check if a session is active
const checkSession = (req, res, next) => {
    if (!req.session.username) {
        // If no active session, redirect to the login page
        return res.redirect("/login");
    }
    // If session is active, proceed to the next middleware
    next();
};

module.exports = {
    checkSession: checkSession,
};
