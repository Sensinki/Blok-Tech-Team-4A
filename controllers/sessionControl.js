/* eslint-disable indent */
const checkSession = (req, res, next) => {
    if (!req.session.username) {
        return res.redirect("/login");
    }
    next();
};

module.exports = {
    checkSession: checkSession,
};
