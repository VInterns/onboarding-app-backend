var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
var mustache = require('mustache');
// const template = require("../utils/mailtemplate.html");
// var nodemailer = require("../utils/nodemailler");

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

  console.log('some on called bulkRegister api', req.body.Sheet1, req.body.Sheet1.length);
  let data = req.body.Sheet1;
  // console.log('data is --> ', data);
  try {

    // await fs.writeFileSync("./Public/Excel/Users/newUsers.xlsx", req.file.buffer);
    var errorResult = [];
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
        useful: req.body.Sheet1[i].useful,
      }
      console.log('uploadUser --> ', uploadUser);

    }
    // const result = Joi.validate(uploadUser, UserValidation);
    // if (result.error) {
    //   // errorResult.push(`Row: ${i + 1} ==> ${result.error.details[0].message}`);
    // }

    if (errorResult.length > 0) {
      // console.log('errorResult --> ', errorResult);
      return res.status(400).send(errorResult);
    }

    else {
      // console.log('insdie else, data.lenght --> ', data);
      for (var i = 0; i < data.length; i++) {

        var user = await User.findOne({ email: data[i].email });
        if (user) {
          user.set({
            fullName: data[i].fullName,
            email: data[i].email,
            staffId: data[i].staffId,
            firstName: data[i].firstName,
            lastName: data[i].lastName,
            password: '123',
            department: data[i].department,
            company: data[i].company,
            enggaging: data[i].enggaging,
            useful: data[i].useful,
          });
          console.log('existed user before save--> ', user);
          await user.save();
        }
        else {
          var userByEmail = await User.findOne({ email: data[i].email });
          if (!userByEmail) {

            var newUser = new User({
              fullName: data[i].fullName,
              email: data[i].email,
              staffId: data[i].staffId,
              firstName: data[i].firstName,
              lastName: data[i].lastName,
              department: data[i].department,
              password: '123',
              company: data[i].company,
              enggaging: data[i].enggaging,
              useful: data[i].useful,
            });
            console.log('newUser after save--> ', newUser);
            const result = await newUser.save();
            console.log('result of save', result);
            if (result) {
              console.log('nodemailer to --> ', result.email);

              sendEmail(result);


            }
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


router.get("/users", async (req, res) => {

  let users = await User.find( function(error , response){
    
    if (error) {
      res.send(error);
    }else{
      console.log('response', response);
      res.send(response);
    }
  });

});

router.post("/sectionupdate", async (req,res) =>{

  // console.log('inside sectionupdate api', req);
  // var reqUser = new User({
  //   id: req.body._id,
  //   lastSection: req.body.lastSection
  // });

  // console.log('reqUser is -->', reqUser.id);
  // console.log('req._id is  -->', req.body._id);

  let user = await User.findOne({_id :req.body._id}, function (error, response) {
    if (error) {
      // console.log(error);
      res.send(error);
    }else if (response) {
      // console.log('response is -->',response); 
    }
  });
  console.log('let user is -->', user);

  if (!user) {
    res.status(404).send('No such user found');
  }else{
    user.lastSection = req.body.lastSection;

    // const result = await user.save();

    const newUser = await User.findOneAndUpdate({ _id:req.body._id}, {$set: { lastSection: user.lastSection }}, {upsert:true}, function(err, doc){
      if (err){

         return res.send(500, { error: err });
      }else{
        return res.status(200).send("succesfully saved");
      }
  });
  // console.log('success newuser is --> ', newUser);


    // console.log('result is -->', result);
    // res.status(200).send(result);

  }
});


function sendEmail(user) {
  fs.readFile('./utils/passwordTemplate.html', 'utf8',
    function (err, mailTemplate) {
      if (err) throw err;
      console.log('inside sendEmail mailTo is-->', user);
      // TODO: make the mail template ready
      let actualMail = mustache.render(mailTemplate, user);

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: 'm.osamaalmokadem@gmail.com',
          pass: 'loveyoubaby'
        }
      });

      let mailOptions = {
        from: 'm.osamaalmokadem@gmail.com',
        to: user.email,
        subject: 'Welcome ' +user.fullName+' to Vodafone',
        html: actualMail
      };

      transporter.sendMail(mailOptions,
        function (error, info) {
          if (error) {
            throw error
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    });

}



module.exports = router;