var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");
// const upload = require('./upload');
// const cors = require('cors');

var fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
var multer = require('multer');
var upload = multer({ storage: multer.memoryStorage() });


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

router.post("/bulkRegister", async (req, res) => {

  console.log('some on called bulkRegister api', req.body.Sheet1,req.body.Sheet1.length);
  let data = req.body.Sheet1;
  console.log('data is --> ', data);
  try {

    // await fs.writeFileSync("./Public/Excel/Users/newUsers.xlsx", req.file.buffer);
    var errorResult = [];
    // var rows = await readXlsxFile("./Public/Excel/Users/newUsers.xlsx");

    for (var i = 0; i < req.body.Sheet1.length; i++) {

    
      console.log('inside for loop',req.body.Sheet1[i].userName);
      var uploadUser = {
        userName: req.body.Sheet1[i].userName,
        email: req.body.Sheet1[i].email,
        mobileNumber: req.body.Sheet1[i].mobileNumber,
        company: req.body.Sheet1[i].company,
        enggaging: req.body.Sheet1[i].enggaging,
        useful: req.body.Sheet1[i].useful,
      }
      console.log('uploadUser --> ',uploadUser);

    }
    // const result = Joi.validate(uploadUser, UserValidation);
    // if (result.error) {
    //   // errorResult.push(`Row: ${i + 1} ==> ${result.error.details[0].message}`);
    // }

    if (errorResult.length > 0){
      console.log('errorResult --> ', errorResult);
      return res.status(400).send(errorResult);
    }

    else {
      console.log('insdie else, data.lenght --> ', data);
      for (var i = 0; i < data.length; i++) {

        var user = await User.findOne({ email: data[i].email });
        if (user) {
          user.set({
            userName: data[i].userName,
            email: data[i].email,
            mobileNumber: data[i].mobileNumber,
            company: data[i].company,
            enggaging: data[i].enggaging,
            useful: data[i].useful,
          });
          console.log('user before save--> ',user);
          await user.save();
        }
        else {
          var userByEmail = await User.findOne({ email: data[i].email });
          if (!userByEmail) {

            // const User = mongoose.model('User', userSchema); 
            var newUser = new User({
              userName: data[i].userName,
              email: data[i].email,
              mobileNumber: data[i].mobileNumber,
              company: data[i].company,
              enggaging: data[i].enggaging,
              useful: data[i].useful,
            });
            console.log('newUser before save--> ',newUser);
            const result = await newUser.save();
            console.log(result);
            // await newUser.save();
          }
        }
      }
      return res.send({ message: 'Data inserted successfully.' });
    }

  } catch (error) {

  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("logiiiiiiiin");
    var user = await User.findOne({
      password: req.body.password,
      email: req.body.email
    });
    console.log(user);

    if (user) {
      return res.json({
        token: jwt.sign(
          { email: user.email, _id: user._id },
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