var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campgrounds.js"),
    Comment         = require("./models/comments.js"),
    User            = require("./models/user.js"),
    seedDB          = require("./seeds");
    

    
//makes naming files ".ejs" optional
app.set("view engine", "ejs");

//makes it possible to get information from postrequests
app.use(bodyParser.urlencoded({extended: true}));

//macht momentanen user auf allen weiteren Ebenen verfügbar
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


//database connection
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Okay, this has to be extreeeemely secret, alrightyyyy 2314234hdsfg",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


    
seedDB();


app.get("/", function(req, res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    
});

//CREATE
app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name,image: image, description: desc};
    
    //Create new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
    
});

//NEW
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs");
});


//SHOW - shows more information about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            
            //render show template with that campground 
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
    

})

//=====================================
//COMMENTs ROUTES
//=====================================

app.get("/campgrounds/:id/comments/new", isLoggedIn,  function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); 
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    //lookup campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground showpage
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    }); 
    
});

//==================
//   AUTH ROUTES
//==================

//show register form
app.get("/register", function(req, res) {
   res.render("register.ejs"); 
});

//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login.ejs");
})
//handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req,res){
});

//logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started. YelpCamp is ready :) I love you");
});
