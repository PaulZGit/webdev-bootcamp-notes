var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("home");
});

app.get("/speak/:animalName", function(req, res){
    var animalName = req.params.animalName;
    switch(animalName){
        case "dog":
            res.send("Woof Woof");
        case "pig":
            res.send("Oink");
        case "cow":
            res.send("Mooo");
    }
});

app.get("/fallinlovewith/:thing", function(req, res){
   var thing = req.params.thing;
   res.render("love", {thingvar: thing});
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "Erster!", author:"Paul"},
        {title: "Mein Penis ist lang!", author:"Voelpel"},
        {title: "Amenakoi", author:"Hans Entertainment"},
    ]
    res.render("post", {posts:posts});
});

app.get("/repeat/:word/:times", function(req, res){
    var times = req.params.times;
    var word  = req.params.word;
    var string = ""; 
    
    for(var i = 0; i<times; i++){
        string += word;
        string += " ";
    }
    res.send(string);
});

app.get("*", function(req, res) {
    res.send("Falsche Adresse jo");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started, you Badass ;)");
})

