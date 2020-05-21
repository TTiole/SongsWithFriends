// Import any spotify requests we write
const { getUser } = require("../users");
const { getUserPlaylists } = require("../requests");

module.exports = (app) => {
  // Endpoints here

  app.get("/playlists", function (req, res) {
    console.log("trying to get playlists");

    getUserPlaylists(getUser(req.query.userID))
      .then((data) => {
        // Items is an array of "playlist objects"
        const playlists = data.items;
        console.log(playlists);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Some Errors Occured");
      });
  });
};
