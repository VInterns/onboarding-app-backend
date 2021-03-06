const mongoose = require("mongoose");
const { getDatabaseUrl } = require("../utils/utilities");

mongoose.set('useNewUrlParser', true);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(getDatabaseUrl(), err => {
  if (!err) console.log("MongoDB connection succeeded.");
  else
    console.log(
      "Error in DB connection : " + JSON.stringify(err, undefined, 2)
    );
});


module.exports = mongoose;
