
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var project = require('./routes/project');
// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/project', project.viewProject);
app.get('/project/:name', project.viewProject);
// Example route
// app.get('/users', user.list);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We re in baby");

  /*
  .d8888.  .o88b. db   db d88888b .88b  d88.  .d8b.
  88'  YP d8P  Y8 88   88 88'     88'YbdP`88 d8' `8b
  `8bo.   8P      88ooo88 88ooooo 88  88  88 88ooo88
    `Y8b. 8b      88~~~88 88~~~~~ 88  88  88 88~~~88
  db   8D Y8b  d8 88   88 88.     88  88  88 88   88
  `8888Y'  `Y88P' YP   YP Y88888P YP  YP  YP YP   YP
  */
  var kittySchema = mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }

  /*
  .88b  d88.  .d88b.  d8888b. d88888b db
  88'YbdP`88 .8P  Y8. 88  `8D 88'     88
  88  88  88 88    88 88   88 88ooooo 88
  88  88  88 88    88 88   88 88~~~~~ 88
  88  88  88 `8b  d8' 88  .8D 88.     88booo.
  YP  YP  YP  `Y88P'  Y8888D' Y88888P Y88888P
  */

  var Kitten = mongoose.model('Kitten', kittySchema);


  /*
  d8888b.  .d8b.  d888888b  .d8b.        .d88b.  d8888b.
  88  `8D d8' `8b `~~88~~' d8' `8b      .8P  Y8. 88  `8D
  88   88 88ooo88    88    88ooo88      88    88 88oodD'
  88   88 88~~~88    88    88~~~88      88    88 88~~~
  88  .8D 88   88    88    88   88      `8b  d8' 88
  Y8888D' YP   YP    YP    YP   YP       `Y88P'  88
  */
  var silence = new Kitten({ name: 'Silence' });
  //console.log(silence.name);
  //var fluffy = new Kitten({ name: 'fluffy' });

  /*
  silence.save(function (err, silence) {
    if (err) return console.error(err);
    silence.speak();
  });*/

  // Kitten.find(function (err, kittens) {
  //   if (err) return console.error(err);
  //   console.log(kittens);
  // });
  Kitten.find({ name: /^fluff/ }, function (err, kittens) {
    if (err) return console.error(err);
    console.log("In app.js");
    console.log("/^fluff/ objects:");
    console.log(kittens);
  });

  app.locals.Kitten = Kitten;
}); // end of db.once


/*
.d8888.  .d8b.  db    db d88888b      d8888b. d8888b.      d8888b. d88888b d88888b
88'  YP d8' `8b 88    88 88'          88  `8D 88  `8D      88  `8D 88'     88'
`8bo.   88ooo88 Y8    8P 88ooooo      88   88 88oooY'      88oobY' 88ooooo 88ooo
  `Y8b. 88~~~88 `8b  d8' 88~~~~~      88   88 88~~~b.      88`8b   88~~~~~ 88~~~
db   8D 88   88  `8bd8'  88.          88  .8D 88   8D      88 `88. 88.     88
`8888Y' YP   YP    YP    Y88888P      Y8888D' Y8888P'      88   YD Y88888P YP
*/

app.locals.mongoose = mongoose;
app.locals.db = db;


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
