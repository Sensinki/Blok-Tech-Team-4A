/* eslint-disable indent */
// Controller function for handling a 404 error
function handle404Error(req, res) {
    res.status(404).render("404", { title: "404 Not Found :(" });
}

module.exports = {
    handle404Error,
};
