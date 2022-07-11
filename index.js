// index.js
// where your node app starts

// init project
require("dotenv").config();
var express = require("express");
var app = express();
app.set("trust proxy", true);
const requestIp = require("request-ip");
app.use(requestIp.mw());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/whoami", function (req, res) {
  // console.log(req.ip);
  const ipaddress = req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];
  res.json({ ipaddress, language, software });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

function getClientIp(req) {
  if (req.headers["x-forwarded-for"]) {
    // try to get from x-forwared-for if it set (behind reverse proxy)
    return req.headers["x-forwarded-for"].split(",")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    // no proxy, try getting from connection.remoteAddress
    return req.connection.remoteAddress;
  } else if (req.socket) {
    // try to get it from req.socket
    return req.socket.remoteAddress;
  } else if (req.connection && req.connection.socket) {
    // try to get it form the connection.socket
    return req.connection.socket.remoteAddress;
  } else {
    // if non above, fallback.
    return req.ip;
  }
}
