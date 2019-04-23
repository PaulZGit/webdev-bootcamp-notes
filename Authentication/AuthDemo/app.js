var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    User        = require("./models/user"),
    bodyParser  = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/authentication_demo",  {useMongoClient: true});

var app = express();

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
    secret: "This is a very secret message, it is not possible to break this",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//==================
//    ROUTES
//==================

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//AUTH ROUTES

//show Signup Form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user signup
app.post("/register", function(req, res){
   
   User.register(new User({username: req.body.username}), req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       } else{
           //User wird jetzt eingeloggt
           passport.authenticate("local")(req, res, function(){
               res.redirect("/secret");
           });
       }
   });
});


//LOGIN ROUTES

//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
//middleware - runs before the final callback
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});

//logout
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
})