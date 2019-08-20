var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  var data = req.body;
  try {
    var segCreate = await User.create(data);
    console.log(segCreate);

    return res.send("User added Successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("logiiiiiiiin");
    var user = await User.findOne({
      password: req.body.password,
      email: req.body.email
    });

    if (user) {
      return res.json({
        token: jwt.sign(
          { email: user.email, name: user.name, _id: user._id },
          "key"
        )
      });
    } else {
      return res.status(500).send("Invalid NT or Password.");
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/authData", auth, async (req, res) => {
  res.json({ message: "Authenication", data: req.user });
});

module.exports = router;
