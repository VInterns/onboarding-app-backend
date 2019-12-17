var express = require("express");
var router = express.Router();
var { User } = require("../models/user.model");
var auth = require("../middleware/auth");


// router.put('/dietary', auth, async (req, res) => {

//     try {
//         var user = await User.findById({ _id: req.user._id });
//         if (!user)
//             return res.status(404).send({ message: `No record with given id : ${req.user._id}` });
//         else {
//             await user.set({ "dietary": req.body });
//             await user.save();
//             return res.send({ message: "Done" });
//         }
//     }
//     catch (error) {
//         return res.status(400).send({ message: error.message });
//     }

// });

// router.put('/allergies', auth, async (req, res) => {

//     try {

//         var user = await User.findById({ _id: req.user._id });
//         if (!user)
//             return res.status(404).send({ message: `No record with given id : ${req.user._id}` });
//         else {
//             await user.set({ allergies: req.body });
//             await user.save();
//             return res.send({ message: 'Done' });
//         }
//     }
//     catch (error) {
//         return res.status(400).send({ message: error.message });
//     }

// });


module.exports = router;


