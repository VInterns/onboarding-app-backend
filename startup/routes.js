var express = require("express");
var app = express();

var account = require("../controllers/account.controller");
var user = require("../controllers/user.controller");
var survey = require("../controllers/survey.controller");
var info = require("../controllers/info.controller");

module.exports = function (app) {
  app.use("/api/account", account);
  app.use("/api/users", user);
  app.use("/api/survey", survey);
  app.use("/api/info", info);
};
