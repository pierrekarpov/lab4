var mongoose = require('mongoose');
var models = require('./models');
var quests_json = require('./data/quests.json');
var questIDs = [];

var mongodbUri = 'mongodb://heroku_qrb8bt7t:k9ki1b3bnvg7tvnpf45cssn0f6@ds041583.mlab.com:41583/heroku_qrb8bt7t';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //drop table
  models.Quest
      .find()
      .remove()
      .exec(function(){console.log("Quest table dropped"); addQuests();});

  //add quests
  addQuests = function() {
    var i = quests_json.length;
    quests_json.forEach(function(q){
      var quest = new models.Quest(q);
      quest.save(function(err, quest) {
          if (err) console.log(err);
          questIDs.push({'title': quest.title, 'id': quest._id});
          i--;
          if(i <= 0) {
            closeDB();
          }
      });
    });
  }

  //close db
  closeDB = function() {
    console.log(questIDs);
    mongoose.connection.close();
  }
});
