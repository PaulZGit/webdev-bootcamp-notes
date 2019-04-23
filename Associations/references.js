var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/blog-demo2");

var Post = require("./Models/post");
var User = require("./Models/user");




// //Find User
// User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user){
//     if(err){
//         console.log(err);
//     } else{
//         console.log(user);
//     }
// });

//Find all Posts for that User

Post.create(
    {
        title: "How to cook the best Burger Pt 4",
        content: "HSDFOHSLDHFU"
    }, 
    function(err, post){
        User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
            if(err){
                console.log(err);
            } else{
                foundUser.posts.push(post);
                foundUser.save(function(err, data){
                    if(err){
                        console.log(err);
                    } else{
                        console.log(data);
                    }
                });
            }
        });
    }
);


// User.create({
//     email: "bob@gmail.com",
//     name: "Bob"
// })

