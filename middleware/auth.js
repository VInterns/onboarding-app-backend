var jwt = require("jsonwebtoken");

module.exports =  function (req, res, next) {
    // Get auth header value
    var bearerToken="";
    const bearerHeader = req.headers["authorization"];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
      // Split at the space
      const bearer = bearerHeader.split(" ");
      // Get token from array
       bearerToken = bearer[1];

      if (!bearerToken) {
        return res.status(401).send({ message: 'Access denied ... No token provided' });
    }
  }
  else {
    // Forbidden
    res.sendStatus(403);
  }
    try {
        const decoded = jwt.verify(bearerToken, 'key');
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
    } 
  


