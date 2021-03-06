var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
var mustache = require("mustache");
const bcrypt = require("bcryptjs");
const mailSender = require("../Services/mail").sendEmail;
var generator = require("generate-password");

var fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });
const Joi = require('joi');
const registerSchema = require("../joi_validations/registerSchema");


router.post("/bulkRegister", async (req, res) => {
  let data = req.body.Sheet1;
  var errorResult = [];
  var existingList = [];
  var notValidList = [];

  for (var i = 0; i < req.body.Sheet1.length; i++) {
    var uploadUser = {
      fullName: req.body.Sheet1[i].fullName,
      email: req.body.Sheet1[i].email,
      staffId: req.body.Sheet1[i].staffId,
      firstName: req.body.Sheet1[i].firstName,
      lastName: req.body.Sheet1[i].lastName,
      department: req.body.Sheet1[i].department,
      company: req.body.Sheet1[i].company,
      enggaging: req.body.Sheet1[i].enggaging,
      useful: req.body.Sheet1[i].useful,
      isAdmin: req.body.Sheet1[i].isAdmin
    };
  }

  if (errorResult.length > 0) {
    return res.status(400).send(errorResult);
  } else {
    for (const i of data) {
      console.log("for loop i is --> ", i);
      var user = await User.findOne({ email: i.email.toLowerCase() });
      console.log("user found --> ", user);
      if (user) {
        existingList.push(`Row: ${i + 1} ==> ${user.email} already exists`);
      } else {
        var userByEmail = await User.findOne({
          email: i.email.toLowerCase()
        });
        if (!userByEmail) {
          let newUser = {};
          console.log("empty obk]jecg ", newUser);
          newUser = new User({
            fullName: i.fullName,
            email: i.email.toLowerCase(),
            staffId: i.staffId,
            firstName: i.firstName,
            lastName: i.lastName,
            department: i.department,
            password: generator.generate({
              length: 5,
              numbers: false,
              uppercase :false,
            }),
            company: i.company,
            enggaging: i.enggaging,
            useful: i.useful,
            isAdmin: i.isAdmin
          });

          await bcrypt.hash(newUser.password, 10, async function(err, hash) {
            let passwordForMail = newUser.password;
            newUser.password = hash;
            const result = await newUser.save();
            if (result) {
              sendEmail(result, passwordForMail);
            }
          });
          if (!userByEmail) {
            let newUser = {};
            console.log("empty object ", newUser);
            newUser = new User({
              fullName: i.fullName,
              email: i.email.toLowerCase(),
              staffId: i.staffId,
              firstName: i.firstName,
              lastName: i.lastName,
              department: i.department,
              password: "123",
              company: i.company,
              enggaging: i.enggaging,
              useful: i.useful
            });
            await bcrypt.hash(newUser.password, 10, async function (err, hash) {
              let passwordForMail = newUser.password;
              newUser.password = hash;
            });

            Joi.validate(newUser, registerSchema, (err, value) => {
              if (err) {

                notValidList.push(`Row: ${i + 1} ==> ${newUser.email} this user is not valid`);

                // res.status(422).json({
                //   status: 'error',
                //   message: 'Invalid request data',
                //   data: data
                // });
              } else {

                newUser.save();
                sendEmail(result, passwordForMail);
              }
            });

          }
        }
      }
    }
    return res.send({ message: "Data inserted successfully.", existingList, notValidList });
  }
});

router.post("/login", async (req, res) => {
  try {
    userEmail = req.body.email.toLowerCase();
    var dbUser = await User.findOne({
      // password: req.body.password,
      email: userEmail
    });
    console.log(dbUser);

    if (dbUser) {

      // console.log('bcrypt')
      bcrypt.compare(req.body.password, dbUser.password, function(
        err,
        response
      ) {
        if (response) {
          // Passwords match
          return res.json({
            token: jwt.sign({ email: dbUser.email, _id: dbUser._id }, "key")
          });
        } else {
          return res.status(401).send("Invalid NT or Password.");
        }
      });
    } else {
      return res.status(401).send("Invalid NT or Password.");
    }
  } catch (error) {
    console.log("insdie catch");
    return res.status(500).send(error.message);
  }
});

router.post("/login/admin", async (req, res) => {
  try {
    // console.log("logiiiiiiiin");
    userEmail = req.body.email.toLowerCase();
    var dbUser = await User.findOne({
      // password: req.body.password,
      email: userEmail,
      isAdmin: true
    });
    console.log(dbUser);

    if (dbUser) {
      // console.log('bcrypt')
      bcrypt.compare(req.body.password, dbUser.password, function(
        err,
        response
      ) {
        if (response) {
          // Passwords match
          return res.json({
            token: jwt.sign({ email: dbUser.email, _id: dbUser._id }, "key", {
              expiresIn: 900
            })
          });
        } else {
          // console.log(`password don't match`);
          return res.status(401).send("Invalid NT or Password.");
          // Passwords don't match
        }
      });
    } else {
      // console.log("insdie else");
      return res.status(401).send("Invalid NT or Password.");
    }
  } catch (error) {
    // console.log("insdie catch");
    return res.status(500).send(error.message);
  }
});

router.get("/authData", auth, async (req, res) => {
  res.json({ message: "Authenication", data: req.user });
});

router.get("/users", auth, async (req, res) => {
  let users = await User.find(function(error, response) {
    if (error) {
      res.send(error);
    } else {
      console.log("response", response);
      res.send(response);
    }
  });
});

router.post("/sectionupdate", async (req, res) => {
  let user = await User.findOne({ _id: req.body._id }, function(
    error,
    response
  ) {
    if (error) {
      // console.log(error);
      res.send(error);
    }
  });

  if (!user) {
    res.status(404).send("No such user found");
  } else {
    user.lastSection = req.body.lastSection;

    // const result = await user.save();

    const newUser = await User.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { lastSection: user.lastSection } },
      { upsert: true },
      function(err, doc) {
        if (err) {
          return res.send(500, { error: err });
        } else {
          return res.status(200).send("succesfully saved");
        }
      }
    );
  }
});

function sendEmail(user, passwordForMail) {
  user.password = passwordForMail;
  fs.readFile("./utils/passwordTemplate.html", "utf8", function(
    err,
    mailTemplate
  ) {
    if (err) throw err;
    console.log("inside sendEmail mailTo is-->", user);
    // TODO: make the mail template ready
    let actualMail = mustache.render(mailTemplate, user);

    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   host: "smtp.gmail.com",
    //   port: 587,
    //   secure: false,
    //   requireTLS: true,
    //   auth: {
    //     user: "vodafoneonboarding@gmail.com",
    //     pass: "Vodafone@1234"
    //   }
    // });

    // let mailOptions = {
    //   from: "vodafoneonboarding@gmail.com",
    //   to: user.email,
    //   subject: "Welcome " + user.fullName + " to Vodafone",
    //   html: actualMail
    // };

    // transporter.sendMail(mailOptions, function(error, info) {
    //   if (error) {
    //     throw error;
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });

    mailSender(user.email, "Welcome " + user.fullName + " to Vodafone", actualMail, () => {
      console.log('mail sent', user.email);
    }, (error) => {
      console.log(error);
    })
  });
}

module.exports = router;
