var mongoose = require("mongoose");
var TrekSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "Comments"
    }
  ]
});

module.exports = mongoose.model("Trek",TrekSchema);
