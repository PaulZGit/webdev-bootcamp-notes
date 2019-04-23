var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useMongoClient: true});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);


//adding a new cats to database
var george = new Cat({
    name: "George",
    age: 11,
    temperament: "Grouchy"
});
/*
george.save(function(err,cat){
   if(err) {
       console.log("Something went wrond :(");
   } else{
       console.log("You just saved a cat :D!");
       console.log(cat);
   }
});*/

Cat.find({}, function(err, cats){
      if(err){
        console.log("Oh no, Error");
        console.log(err);
      }
      else{
        console.log(cats);
      }
});