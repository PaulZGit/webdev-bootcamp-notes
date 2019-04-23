var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local");
    // Campground  = require("./models/campground"),
    // Comment     = require("./models/comment"),

//Models for MongoDB
var User = require("./models/user");
var Tagestipp = require("./models/tagestipp"); 


mongoose.connect("mongodb://localhost/lotto",  {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//macht momentanen user auf allen weiteren Ebenen verfügbar
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function(req, res){
   res.render("index.ejs");
});

//----------------
// RERGISTRIERUNG
//----------------

//show register form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

//register logic
app.post("/register", function(req, res){
    //create new user object
    console.log("So sieht der User aus: " + req.body.username)
    var newUser = new User({username: req.body.username});
    
    //save user to db
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("Fehler bei der Registrierung!");
            console.log(err);
            return res.render("register");
        } else{
            passport.authenticate("local")(req, res, function(){
                //redirect to homepage
                //hier später: E-Mail rausschicken zur Bestätigung
                res.redirect("/"); 
            });
        }
        
    });
    
});

//------------------
//     LOGIN
//------------------

//show login form
app.get("/login", function(req, res){
    res.render("login.ejs");
});

//login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/tippen",
        failureRedirect: "/login"
    }), 
    function(req, res){
});


//------------------
// Schon eingeloggt
//------------------
app.get("/tippen",  isLoggedIn, function(req, res) {
    var currentUser = req.user; 
    var currentTagestipp = "";
    Tagestipp.findById(req.user.tagestipps, function(err, foundTagestipp){
        if(err){
            console.log(err);
        } else{
            currentTagestipp = foundTagestipp;
        }
    res.render("tippen.ejs", {foundTagestipp: foundTagestipp});
    });
});

//Zufallstipp
app.post("/tippen/random", isLoggedIn, function(req, res){
    
    //So lange 3 Zufallszahlen generieren, bis richtig
    do{
        var zahl1 = Math.floor((Math.random() * 49) + 1);
        var zahl2 = Math.floor((Math.random() * 49) + 1);
        var zahl3 = Math.floor((Math.random() * 49) + 1);
        
        //Zahlen sortieren
        var zahlen = [zahl1, zahl2, zahl3];
        zahlen.sort();
        
        zahl1 = zahlen[0];
        zahl2 = zahlen[1];
        zahl3 = zahlen[2];
        
    } while(!tippPruefen(zahl1, zahl2, zahl3));
    
    
    //prüfen ob User schon einen Tagestipp hat
    if(req.user.tagestipps.length == 0){
        Tagestipp.create({},function(err, tagestipp){
            if(err){
              console.log(err);
            } else{
                tagestipp.count = 0;
                tagestipp.save();
                req.user.tagestipps.push(tagestipp);
                req.user.save(function(err){
                    tippAbgeben(zahl1, zahl2, zahl3, req);    
                });
                
            }
        });
        
    } else{
        tippAbgeben(zahl1, zahl2, zahl3, req);
    }
    
   res.redirect("/tippen");
    
});

app.post("/tippen", isLoggedIn, function(req, res) {

    var zahl1 = req.body.zahl1;
    var zahl2 = req.body.zahl2;
    var zahl3 = req.body.zahl3;
    
    //Zahlen sortieren und prüfen
    var zahlen = [zahl1, zahl2, zahl3];
    zahlen.sort();
    
    zahl1 = zahlen[0];
    zahl2 = zahlen[1];
    zahl3 = zahlen[2];
    
    if(!tippPruefen(zahl1, zahl2, zahl3)){
        console.log("Falsche Zahlen!"); 
        res.redirect("/tippen");
        return;
    }
    
    //prüfen ob User schon einen Tagestipp hat
    if(req.user.tagestipps.length == 0){
        Tagestipp.create({},function(err, tagestipp){
            if(err){
              console.log(err);
            } else{
                tagestipp.count = 0;
                tagestipp.save();
                req.user.tagestipps.push(tagestipp);
                req.user.save(function(err){
                    tippAbgeben(zahl1, zahl2, zahl3, req);    
                });
                
            }
        });
        
    } else{
        tippAbgeben(zahl1, zahl2, zahl3, req);
    }
    
   res.redirect("/tippen");
});



//Heutigen Tagestipp löschen
app.post("/tippen/deleteall", function(req, res){
    
    console.log(req.user);
    req.user.tagestipps.pop();
    req.user.save(function(err){
        if(err){
            console.log(err);
        }
    });
    
    res.redirect("/tippen");
});

function tippAbgeben(zahl1, zahl2, zahl3, req){
    //get latest tagestipp from user
    var currentId =  req.user.tagestipps[req.user.tagestipps.length-1];
    Tagestipp.findById(currentId, function(err, foundTagestipp){
        if(err){
            console.log(err);
        } else{
            if(foundTagestipp.count>4){
                console.log("Heute genug getippt");
            } else{
                foundTagestipp.tips.push([zahl1, zahl2, zahl3]); 
                foundTagestipp.count++;
                foundTagestipp.save();
                console.log("Tagestipp:" +foundTagestipp);
                console.log("count:" + foundTagestipp.count);
            }
            
        }
    });
}

function tippPruefen(zahl1, zahl2, zahl3){
    if(zahl1 < 1){
        return false;
    } else if(zahl3 > 49){
        return false;
    } else if(zahl1 == zahl2 || zahl2 == zahl3){
        return false;
    } else{
        return true;
    }
}


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Der Server ist gestartet! ");
});