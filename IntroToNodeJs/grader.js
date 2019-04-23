var scores = [90,98,89,100,100,86,94];
average(scores);

var catMe = require("cat-me");
var joke = require("knock-knock-jokes");
console.log(joke());

function average(array){
    var sum = 0;
    for(var i = 0; i< array.length; i++){
        sum += array[i];
    }
    console.log(Math.round(sum/array.length));
}