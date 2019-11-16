const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: true
  },
  lastSection:{
    type: String,
    required: false
  },
  useful:{
    type:Number,
    required: false
  },
  enggaging:{
    type: Number,
    required: false
  },
  comment:{
    type:String,
    required: false
  }
});

var User = mongoose.model("User", UserSchema);
module.exports = { User };
