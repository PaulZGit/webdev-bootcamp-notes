var express = require("express");
var app = express();

app.get("/", function(req, res){
   res.send("Jo ihr bitches");
});

app.get("/bye", function(req, res){
    res.send("Tschau, ihr Fotzen! Ich liebe diesen Scheiß :)");
});

app.get("/r/:subredditName", function(req, res) {
    res.send("Willkommen im Subreddit " + req.params.subredditName);
    console.log(req.params);
})

app.get("*", function(req, res){
    res.send("You are a Star ;) ");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});