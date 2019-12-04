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
        if(result){
            res.status(200).send("Survey Added Successfully");
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }

    // const user = new User({});
});



module.exports = router;    

