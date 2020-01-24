const mongoose = require("mongoose");


mongoose.set('useNewUrlParser', true);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost:27017/OnBoarding", err => {
  if (!err) {console.log("MongoDB connection succeeded.");
}else
    console.log(
      "Error in DB connection : " + JSON.stringify(err, undefined, 2)
    );
 
});


module.exports = mongoose;
