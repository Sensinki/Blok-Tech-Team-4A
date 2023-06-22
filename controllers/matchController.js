const User = require("../models/userModel");
const match = (req, res) => {
  res.render("match");
};
const matchPost = async (req, res) => {
  const user = await User.findOne({username: req.session.username});
  user
    .likedGames
    .push(req.body);
  await user.save();
  res.sendStatus(200);
};

module.exports = {
  match,
  matchPost
};
module.exports = {
  match
};
