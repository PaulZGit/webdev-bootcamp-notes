var mongodb = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");

var data = [
    {
        name: "Apolda City Campingplatz",
        image: "https://cdn.pixabay.com/photo/2016/04/28/15/49/airstream-1359135__340.jpg",
        description: "Whatever hoodie cliche, poutine butcher cray gastropub franzen. Try-hard copper mug fashion axe sartorial semiotics distillery. Selfies tofu umami chambray ugh. Jianbing cronut cliche selvage, man bun church-key man braid vinyl live-edge before they sold out chillwave artisan lyft bushwick. Try-hard poke helvetica, crucifix whatever bespoke cold-pressed affogato adaptogen distillery. Vinyl austin fixie offal vexillologist. Forage selvage snackwave, pickled cray four dollar toast everyday carry thundercats trust fund craft beer palo santo tote bag. +1 readymade direct trade iPhone, whatever portland four dollar toast viral ramps austin bushwick enamel pin jianbing narwhal subway tile. Slow-carb craft beer enamel pin flannel actually skateboard tote bag listicle disrupt gochujang."
    },
    
    {
        name: "Hohenfelden Campingplatz",
        image: "https://cdn.pixabay.com/photo/2015/09/14/13/57/campground-939588__340.jpg",
        description: "Tilde kogi letterpress, flannel hammock enamel pin shabby chic green juice. Enamel pin trust fund poke semiotics slow-carb. Mixtape hexagon iceland ugh kale chips portland plaid. Typewriter paleo crucifix, keffiyeh lomo vape squid hexagon brooklyn art party polaroid cornhole. Semiotics gastropub farm-to-table pour-over enamel pin gochujang man bun meditation wayfarers copper mug squid tofu unicorn. Wayfarers put a bird on it succulents photo booth, pork belly chicharrones authentic kombucha YOLO kinfolk polaroid slow-carb beard aesthetic. Small batch mumblecore chartreuse biodiesel pitchfork tote bag. Vice ugh literally bicycle rights readymade, tousled lomo fanny pack green juice 90's put a bird on it prism everyday carry franzen. Bespoke XOXO authentic banjo cred brooklyn live-edge tumeric hell of irony. Seitan jean shorts authentic kinfolk."
    },
    
     {
        name: "Neustadt Glewe",
        image: "https://cdn.pixabay.com/photo/2014/12/01/16/24/chicken-552958__340.jpg",
        description: "Gluten-free banh mi meditation, hella squid hell of everyday carry tacos try-hard. IPhone enamel pin pinterest selfies. Yuccie pour-over taxidermy cronut post-ironic, viral gluten-free lumbersexual kogi vape farm-to-table. Ethical hot chicken williamsburg, scenester man bun food truck yr austin banjo woke sriracha YOLO edison bulb +1 fingerstache. Chillwave butcher truffaut synth. Master cleanse vegan DIY, chicharrones flexitarian wayfarers letterpress actually pitchfork cornhole jianbing biodiesel 3 wolf moon pabst meggings. Actually etsy poutine, williamsburg ethical squid bespoke tousled green juice selvage. Echo park prism roof party poke. Fanny pack ramps deep v, air plant glossier cliche enamel pin."
    }
]

function seedDB(){
    Campground.remove({}, function(err){
        //remove all campgrounds
        if(err){
            console.log(err);
        } else{
            
            console.log("All campgrounds removed");
            
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        
                        //create A comment
                        Comment.create(
                            {
                                text: "Hier ist es toll, aber hat leider kein Internet", 
                                author: "Paul"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else{
                                    campground.comments.push(comment);
                                    campground.save(); 
                                    console.log("created new comment");
                                }
                                
                            });
                        
                        
                    }
                });
            });
            
        };
    });
    

    
};

module.exports = seedDB;