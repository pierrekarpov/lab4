var mongoose = require('mongoose');
var models = require('./models');
var users_json = require('./data/users.json');
var userIDs = [];

var mongodbUri = 'mongodb://heroku_qrb8bt7t:k9ki1b3bnvg7tvnpf45cssn0f6@ds041583.mlab.com:41583/heroku_qrb8bt7t';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //drop table
  models.User
      .find()
      .remove()
      .exec(function(){console.log("User table dropped"); addUsers();});

  //add users
  addUsers = function() {
    var i = users_json.length;
    users_json.forEach(function(u){
      var user = new models.User(u);
      user.save(function(err, user) {
          if (err) console.log(err);
          userIDs.push({'username': user.username, 'id': user._id});
          i--;
          if(i <= 0) {
            closeDB();
          }
      });
    });
  }

  //close db
  closeDB = function() {
    console.log(userIDs);
    mongoose.connection.close();
  }
});
