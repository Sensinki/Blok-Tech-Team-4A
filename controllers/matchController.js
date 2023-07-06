// matchcontroller.js//
const User = require("../models/userModel");
const match = (req, res) => {
  res.render("match");
};
// Send liked games to database //
const matchPost = async (req, res) => {
  const user = await User.findOne({username: req.session.username});
  console.log("request:" + JSON.stringify(req.body));
  const {gameName, gameImage, gameCode} = req.body;

  const likedGame = {
    name: gameName,
    image: gameImage,
    game: gameCode
  };

  user.likedGames.push(likedGame);

  await user.save();
  res.sendStatus(200);
};

// Find User and LikedGames in MongoDB and display in Like page //
const getLikePage = async (req, res) => {
  const user = await User.findOne({ username: req.session.username });
  console.log("User" + user);
  
  const likedGamesArray = user.likedGames;
  res.render("like", { likedGames: likedGamesArray });
};

// Delete user likedGames in a Array
const deleteLikedGame = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.session.username });
    console.log(user);
    const gameId = req.params.id;
    const result = await User.updateOne(
      { _id: user.id },
      { $pull: { likedGames: { _id: gameId } } }
    );
  
    if (result.modifiedCount > 0) {
      console.log(
        `Successfully removed game with ID ${gameId} from likedGames array`
      );
    } else {
      console.log("No changes were made");
    }
    res.redirect("/like");
  } catch (error) {
    console.error("Error deleting liked game:", error);
  }
};
  

module.exports = {
  match,
  matchPost,
  getLikePage,
  deleteLikedGame,
};


