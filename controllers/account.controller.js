var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
var mustache = require("mustache");
const bcrypt = require("bcrypt-nodejs");

var fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
var multer = require("multer");
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
  console.log(
    "some on called bulkRegister api",
    req.body.Sheet1,
    req.body.Sheet1.length
  );
  let data = req.body.Sheet1;
  // console.log('data is --> ', data);
  try {
    // await fs.writeFileSync("./Public/Excel/Users/newUsers.xlsx", req.file.buffer);
    var errorResult = [];
    var existingList = [];
    // var rows = await readXlsxFile("./Public/Excel/Users/newUsers.xlsx");

    for (var i = 0; i < req.body.Sheet1.length; i++) {
      // console.log('inside for loop',req.body.Sheet1[i].userName);
      var uploadUser = {
        fullName: req.body.Sheet1[i].fullName,
        email: req.body.Sheet1[i].email,
        staffId: req.body.Sheet1[i].staffId,
        firstName: req.body.Sheet1[i].firstName,
        lastName: req.body.Sheet1[i].lastName,
        department: req.body.Sheet1[i].department,
        company: req.body.Sheet1[i].company,
        enggaging: req.body.Sheet1[i].enggaging,
        useful: req.body.Sheet1[i].useful
      };
      console.log("uploadUser --> ", uploadUser);
    }
    // const result = Joi.validate(uploadUser, UserValidation);
    // if (result.error) {
    //   // errorResult.push(`Row: ${i + 1} ==> ${result.error.details[0].message}`);
    // }

    if (errorResult.length > 0) {
      // console.log('errorResult --> ', errorResult);
      return res.status(400).send(errorResult);
    } else {
      // console.log('insdie else, data.lenght --> ', data);
      for (var i = 0; i < data.length; i++) {
        var user = await User.findOne({ email: data[i].email.toLowerCase() });

        if (user) {
          existingList.push(`Row: ${i + 1} ==> ${user.email} already exists`);

        } else {

          var userByEmail = await User.findOne({
            email: data[i].email.toLowerCase()

          });
          if (!userByEmail) {
            var newUser = new User({
              fullName: data[i].fullName,
              email: data[i].email.toLowerCase(),
              staffId: data[i].staffId,
              firstName: data[i].firstName,
              lastName: data[i].lastName,
              department: data[i].department,
              password: "123",
              company: data[i].company,
              enggaging: data[i].enggaging,
              useful: data[i].useful
            });
            console.log("newUser after save--> ", newUser);

            await bcrypt.hash(newUser.password, 10, async function (err, hash) {
              // Store hash in database
              let passwordForMail = newUser.password;
              newUser.password = hash;
              console.log("hash is --> ", hash);
              console.log("newUser is --> ", newUser);
              const result = await newUser.save();
              if (result) {
                console.log("nodemailer to --> ", result.email);

                sendEmail(result, passwordForMail);
              }
            });
          }
        }
      }
      return res.send({ message: "Data inserted successfully.", existingList });
    }
  } catch (error) { }
});

router.post("/login", async (req, res) => {
  try {
    console.log("logiiiiiiiin");
    var dbUser = await User.findOne({
      // password: req.body.password,
      email: req.body.email
    });
    console.log(dbUser);

    if (dbUser) {
      console.log('bcrypt')
      bcrypt.compare(req.body.password, dbUser.password, function (
        err,
        response
      ) {
        if (response) {
          // Passwords match
          return res.json({
            token: jwt.sign({ email: dbUser.email, _id: dbUser._id }, "key")
          });
        } else {
          console.log(`password don't match`);
          return res.status(401).send("Invalid NT or Password.");
          // Passwords don't match
        }
      });
    } else {
      console.log("insdie else");
      return res.status(401).send("Invalid NT or Password.");
    }
  } catch (error) {
    console.log("insdie catch");
    return res.status(500).send(error.message);
  }
});

router.get("/authData", auth, async (req, res) => {
  res.json({ message: "Authenication", data: req.user });
});

router.get("/users", async (req, res) => {
  let users = await User.find(function (error, response) {
    if (error) {
      res.send(error);
    } else {
      console.log("response", response);
      res.send(response);
    }
  });
});

router.post("/sectionupdate", async (req, res) => {
  let user = await User.findOne({ _id: req.body._id }, function (
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
      function (err, doc) {
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
  fs.readFile("./utils/passwordTemplate.html", "utf8", function (
    err,
    mailTemplate
  ) {
    if (err) throw err;
    console.log("inside sendEmail mailTo is-->", user);
    // TODO: make the mail template ready
    let actualMail = mustache.render(mailTemplate, user);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "m.osamaalmokadem@gmail.com",
        pass: "loveyoubaby"
      }
    });

    let mailOptions = {
      from: "m.osamaalmokadem@gmail.com",
      to: user.email,
      subject: "Welcome " + user.fullName + " to Vodafone",
      html: actualMail
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
}

module.exports = router;
