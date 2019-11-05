var express = require("express");
var app = express();

var account = require("../controllers/account.controller");
var user = require("../controllers/user.controller");
var survey = require("../controllers/survey.controller");

module.exports = function(app) {
  app.use("/api/account", account);
  app.use("/api/users", user);
  app.use("/api/survey", survey);
};
