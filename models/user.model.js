const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  staffId: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  department: {
    type: String,
    required: false
  },
  lastSection: {
    type: String,
    required: false
  },
  useful: {
    type: Number,
    required: false
  },
  enggaging: {
    type: Number,
    required: false
  },
  comment: {
    type: String,
    required: false
  }
});

var User = mongoose.model("User", UserSchema);
module.exports = { User };
