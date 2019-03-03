var fs = require ('fs');
var data = fs.readFileSync('newDB.json'); 
var newDB = JSON.parse(data);
console.log(newDB);

// console.log ('server is starting');

var express = require('express');

var app = express();

var server = app.listen(3000, listening);

function listening(){
    console.log("listening...");
}


app.use(express.static('website'));
app.get('   ', addData);

function addData(request, response){

}
// add var for changes;







var data = JSON.stringify(data);
fs.writeFile('newDb.json', data ,finished);

function finished(error){
    console.log('change complete.');
}

