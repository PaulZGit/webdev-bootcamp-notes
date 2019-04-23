var mongoose = require("mongoose");

var TagestippSchema = new mongoose.Schema({
    count: Number, 
    date: Date,
    tips: [
        [Number]
    ]
});


module.exports = mongoose.model("Tagestipp", TagestippSchema);