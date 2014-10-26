var express = require('express');
var app = express();
var http = require('http').Server(app);
var https = require('https');
//var fs = require('fs');
//var path = require('path');

//var mongodb = require('mongodb')
//  , MongoClient = mongodb.MongoClient;
//var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var io = require('socket.io')(http);

// all environments

app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
/*
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('chip chocolate chip'));

app.use(app.router);
app.use(express.static(path.join(__dirname, '')));
app.use(express.favicon());
app.use(express.errorHandler());
*/

// mongoose
mongoose.connect(process.env.COMPOSEIO_UMI);

var Schema=mongoose.Schema;

var readingSchema=new Schema({
	added : { type: Date, default: Date.now },
	rmscurrent : Number,
	apparent : Number,
	real : Number,
	rmsvolt : Number,
	powerfactor : Number
});

readingSchema.methods.readValues= function() {
	console.log("Adding: "+this.added.toDateString());
	console.log("RMS Current: "+this.rmscurrent);
	console.log("RMS Voltage: "+this.rmsvolt);
	console.log("Apparent: "+this.apparent);
	console.log("Real Power: "+this.real);
	console.log("Power Factor: "+this.powerfactor);
};

var Reading = mongoose.model('Reading',readingSchema);

app.get('/', function(req, res){
	var urlQuery = require('url').parse(req.url, true);
	if(urlQuery.query.rmscurrent){
		console.log(urlQuery.query.rmscurrent);
		console.log(urlQuery.query.rmsvolt);
		console.log(urlQuery.query.apparent);
		console.log(urlQuery.query.real);
		console.log(urlQuery.query.powerfactor);
		
		var date = new Date();
		var data = {added : date, rmscurrent : urlQuery.query.rmscurrent, rmsvolt : urlQuery.query.rmsvolt, apparent : urlQuery.query.apparent, real : urlQuery.query.real, powerfactor : 
		urlQuery.query.powerfactor};
		
		
		io.emit('reading', data);
		
		var newEntry = new Reading(data);
		
		newEntry.save(function(err) {
			if (err) {
				console.log("ERROR!");
			}
		});
	}
	
	//http://localhost:3000/?rmscurrent=1&rmsvolt=2&apparent=3&real=4&powerfactor=5
	
	
	res.render("index",{});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.get('/view', function(req, res){


	Reading.findOne({}, {}, { sort: { 'added' : -1 } }, function(err, read) {
	  res.render('view', read);
	});
/*
	Reading.findOne( { rmscurrent:1}, function(err,read) {
		console.log(read);
	});
	*/
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
*/