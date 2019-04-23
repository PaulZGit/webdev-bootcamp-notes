var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/blog-demo");

//Post - title, content
var postSchema = new mongoose.Schema({
    title: String, 
    content: String
});
var Post = mongoose.model("Post", postSchema);

//User - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema]
});
var User = mongoose.model("User", userSchema);


/*

var newUser = new User({
    mail: "hallo2@mail",
    name: "Peter"
});



newUser.posts.push({
    title: "Kommentar",
    content: "haha, du Opfa"
})

newUser.save(function(err, user){
    if(err){
        console.log(err);
    } else{
        console.log(user);
    }
});
/*
var newPost = new Post({
    title: "reflection on dope",
    content: "Is Naissssse"
});

newPost.save(function(err, post){
    if(err){
        console.log(err);
    } else{
        console.log(post);
    }
});*/


User.findOne({name: "Peter"}, function(err, user){
    if(err){
        console.log(err);
    } else{
        user.posts.push({
            title: "Lange Stöcke",
            content: "Was soll das eigentlich sein,.... lass mal lieber du :D"
        });
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else{
                console.log(user);
            }
        });
    }
})