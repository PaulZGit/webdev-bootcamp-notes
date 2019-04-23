var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    vorname: String,
    password: String,
    tagestipps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tagestipp"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);