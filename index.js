var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var morgan = require('morgan');
var methodOverride = require('method-override');

var MONGO_URI = process.env.MONGO_URI || 'mongodb://192.168.1.7:27017/whisit';

console.log(mongo);
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var db = mongo.db(MONGO_URI, {
	safe: false
});
var PUBLIC_DIR = './dist/';
var APP_DIR = './app/';

var app = express();

app.use(express.static(PUBLIC_DIR));
app.use(morgan('combined'));
app.use(methodOverride());
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));

var router = require('express').Router();

var COLLECTION = "movies";
var ELEMENT = "movie";


router.get('/', function(req, res) {
	res.sendFile(PUBLIC_DIR + "index.html");
});

router.post("/search", function(req, res) {
	var queryObj = {
		"name": {
			"$regex": req.body.query
		}
	};
	console.log("Search called ", queryObj);
	db.collection(COLLECTION).find(queryObj, {
		limit: 25
	}).sort({
		"lastModified": -1,
		"_id": 1
	}).toArray(function(err, result) {
		if (err) throw err;
		// console.log(result);
		// var response = {};
		console.log("Returing response:", result);
		res.json(result);

	});


});


app.use('/', router);

app.listen(3000);
console.log("Server is up on 3000 ");