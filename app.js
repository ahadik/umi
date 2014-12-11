var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var https = require('https');

var mongoose = require('mongoose');
var io = require('socket.io')(http);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'energy-studio-2014'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess;


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

var light_status = 0;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.get('/graph', function(req, res){
	res.render('graph.ejs');
});

app.get('/', function(req, res){
	sess=req.session;
	if(sess.user){
		res.redirect('/app');
	}else{
		res.render('login.ejs');
	}
});

app.post('/login', function(req, res){
	console.log("here");
	sess = req.session;
	
	sess.user=req.body.user;
	res.end('done');
});

app.get('/app', function(req, res){
	sess=req.session;
	if(sess.user){
		res.render('app.ejs');
	}else{
		res.redirect('/login');
	}
});

app.get('/logout', function(req, res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect('/');
		}
	});
});

app.get('/register', function(req, res){
	sess=req.session;
	if(sess.user){
		res.redirect('/app');
	}else{
		res.render('register.ejs');
	}
});

app.get('/submit', function(req, res){
	var urlQuery = require('url').parse(req.url, true);
	if(urlQuery.query.rmscurrent){
		
		var date = new Date();
		var data = {added : date, rmscurrent : urlQuery.query.rmscurrent, rmsvolt : urlQuery.query.rmsvolt, apparent : urlQuery.query.apparent, real : urlQuery.query.real, powerfactor : 
		urlQuery.query.powerfactor};
		var temp_status;
		if(urlQuery.query.light_status == "1"){
			temp_status = 1;
		}else{
			temp_status = 0;
		}
		
		if(temp_status != light_status){
			io.emit('light_change', temp_status);
		}
		
		light_status = temp_status;
		
		io.emit('reading', data);
		
		var newEntry = new Reading(data);
		
		newEntry.save(function(err) {
			if (err) {
				console.log("ERROR!");
			}
		});
	}
	
	res.setHeader('Content-Type', 'text/plain'); //or text/plain
	res.send('Some text');
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

app.get('/view', function(req, res){


	Reading.findOne({}, {}, { sort: { 'added' : -1 } }, function(err, read) {
		if(read==null){
			res.render('view', {"rmscurrent": 0, "rmsvolt": 0, "apparent": 0, "real": 0, "powerfactor": 0});
		}else{
			res.render('view', read);
		}
	});

});

http.listen(app.get('port'), function(){
  console.log('listening on *: '+app.get('port'));
});