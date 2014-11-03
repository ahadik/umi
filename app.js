var express = require('express');
var app = express();
var http = require('http').Server(app);
var https = require('https');

var mongoose = require('mongoose');
var io = require('socket.io')(http);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


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
		
		var date = new Date();
		var data = {added : date, rmscurrent : urlQuery.query.rmscurrent, rmsvolt : urlQuery.query.rmsvolt, apparent : urlQuery.query.apparent, real : urlQuery.query.real, powerfactor : 
		urlQuery.query.powerfactor};
		
		console.log(data);
		
		io.emit('reading', data);
		
		var newEntry = new Reading(data);
		
		newEntry.save(function(err) {
			if (err) {
				console.log("ERROR!");
			}
		});
	}
	
	
	res.render("index",{});
});

app.get('/clear', function(req, res){
	Reading.remove({  }, function(err) {
	    if (!err) {
			message.type = 'notification!';
	    }
	    else {
			message.type = 'error';
	    }
	});
	res.redirect('/');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.get('/view', function(req, res){


	Reading.findOne({}, {}, { sort: { 'added' : -1 } }, function(err, read) {
		if(read==null){
			res.render('view', {"rmscurrent": 0, "rmsvolt": 0, "apparent": 0, "real": 0, "powerfactor": 0});
		}else{
			res.render('view', read);
		}
	});
/*
	Reading.findOne( { rmscurrent:1}, function(err,read) {
		console.log(read);
	});
	*/
});

http.listen(app.get('port'), function(){
  console.log('listening on *: '+app.get('port'));
});

/*
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
*/