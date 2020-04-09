const express = require('express');
const { mongoose } = require('./startup/db.js');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require("path");

app.use(bodyParser.json());

const cors = require('cors');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});


require('./startup/routes.js')(app);

const port = process.env.PORT || 85;

app.listen(port);


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use(express.static('public'));

app.get("*", (req, res, next) => {

  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public/index.html"));
});