let functions = {};
var options = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ";
var randomLetters = "";


functions.letterGenerator = function(num){
    for (i=0; i<num; i++){
        randomLetters += options.charAt(Math.floor(Math.random()*options.length)); 
    } 
    return randomLetters;
}

functions.randomGenerator = function (){
    return 'EnsoApp_DB_' + (Math.random() * 10000000).toFixed(0) + functions.letterGenerator(3);
}
    

    

module.exports = functions;