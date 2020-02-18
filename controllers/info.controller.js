var express = require("express");
var router = express.Router();


router.get("/", async (req, res) => {
    res.send({ environment: "DEV" })
});



module.exports = router;

