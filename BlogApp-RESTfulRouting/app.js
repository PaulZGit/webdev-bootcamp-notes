//APP Configuration
var express = require("express"),
    bodyParser =  require("body-parser"),  
    mongoose = require("mongoose");

var app = express();


//MongoDB Connection and Schema
mongoose.connect("mongodb://localhost/restfulBlog", {useMongoClient: true});app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    console.log("Du bist auf der Indexseite :D");
    console.log("Du Penis :D");
    res.redirect("/blogs");
});

//RESTFUL ROUTES

//INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs:blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        }
        else{
            //redirect to index
            res.redirect("/blogs");
        }
    });
    
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog:foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog:foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    res.send("Update Route");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});