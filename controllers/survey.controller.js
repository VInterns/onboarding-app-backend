

var express = require("express");
var router = express.Router();
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");


router.post("/addSurvey", async (req, res) => {

    console.log('inside addSuvey api', req.body);
    var data = req.body;

    try {
        const user = await User.findById(data.id);

        if (!user) return res.status(404).send("User not found");

        user.useful = data.useful;
        user.enggaging = data.enggaging;
        user.comment = data.comment;

        const result = await user.save();
        if (result) {
            res.status(200).send("Survey Added Successfully");
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

//get Engaging 1 : count 
//get Engaging 2 : count 

router.get("/ratingCount", async (req, res) => {

    let users = await User.find();
    let ratingModel = {
        enggaging1: Number,
        enggaging2: Number,
        enggaging3: Number,
        enggaging4: Number,
        enggaging5: Number,
        useful1: Number,
        useful2: Number,
        useful3: Number,
        useful4: Number,
        useful5: Number
    }
    // console.log("users in rating count API : ", users);
    ratingModel.enggaging1 = getCount("enggaging", 1, users);
    ratingModel.enggaging2 = getCount("enggaging", 2, users);
    ratingModel.enggaging3 = getCount("enggaging", 3, users);
    ratingModel.enggaging4 = getCount("enggaging", 4, users);
    ratingModel.enggaging5 = getCount("enggaging", 5, users);
    ratingModel.useful1 = getCount("useful", 1, users);
    ratingModel.useful2 = getCount("useful", 2, users);
    ratingModel.useful3 = getCount("useful", 3, users);
    ratingModel.useful4 = getCount("useful", 4, users);
    ratingModel.useful5 = getCount("useful", 5, users);
    res.status(200).send(ratingModel);
    //console.log("Rating model", ratingModel);
});

function getCount(type, number, users) {

    return users.filter(function (user) {
        if (type == "enggaging") {
            return user.enggaging == number;
        }
        else {
            return user.useful == number;
        }
    }).length;
}

module.exports = router;

