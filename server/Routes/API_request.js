require("../users");

module.exports = function (app, fetch, user) {
  app.get("/API_request", function (res, req) {
    console.log(user);
    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: user.token_type + " " + user.token,
      },
    })
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err);
        res.end("Some Errors Occured");
      });
  });
};
