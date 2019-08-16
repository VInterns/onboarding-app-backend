var express = require("express");
var app = express();

var account = require("../controllers/account.controller");
var user = require("../controllers/user.controller");

module.exports = function(app) {
  app.use("/api/account", account);
  app.use("/api/users", user);
};
