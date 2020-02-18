const mongoose = require("mongoose");


mongoose.set('useNewUrlParser', true);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/OnBoarding", err => {
  if (!err) console.log("MongoDB connection succeeded.");
  else
    console.log(
      "Error in DB connection : " + JSON.stringify(err, undefined, 2)
    );
});


module.exports = mongoose;
