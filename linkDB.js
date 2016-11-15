var testDBC = require('./dbCalls');
foo(12);
bar('baguette');
var mongoose = require('mongoose');
var models = require('./models');


//you can also have local db if you want
var mongodbUri = 'mongodb://heroku_qrb8bt7t:k9ki1b3bnvg7tvnpf45cssn0f6@ds041583.mlab.com:41583/heroku_qrb8bt7t';
mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // Do the initialization here

    // Step 1: load the JSON data
    var users_json = require('./data/users.json');
    var quests_json = require('./data/quests.json');

    var quest_to_update = quests_json.length;
    var userIDs = [];


    getUserIDs();


    function getUserIDs() {
      models.User
          .find()
          .exec(function(err, users){
            users.forEach(function(user){
              userIDs.push({
                'username': user.username,
                'id': user._id
              });
            });
            linkTakenByOnQuests();
          });
    }

    function linkTakenByOnQuests() {
        console.log(userIDs);
        models.Quest
            .find()
            .exec(addUsersToQuests);

        function addUsersToQuests(err, quests) {
            if (err) console.log(err);

            quests.forEach(function(quest) {
                // console.log(quest);
                quests_json.forEach(function(quest_json){
                  if(quest_json.title === quest.title) {
                    userIDs.forEach(function(userID){
                      if(userID.username === quest_json.takenBy) {
                        //console.log('quest ' + quest.title + ' taken by ' + quest_json.takenBy + ' : ' + userID.id);
                        models.Quest.findByIdAndUpdate(quest._id
                                                    , { $set: { takenBy: userID.id }}
                                                    , { new: true }
                                                    , function (err, updatedQuest) {
                                                        if (err) console.log(err);
                                                        //console.log(updatedQuest);
                                                        closeDB();
                                                      });
                      }
                    });
                  }
                });
            });
        }
    }
    function closeDB() {
      quest_to_update--;
      console.log("quests to update: " + quest_to_update);
      if( quest_to_update <= 0) {
        console.log("DONE");
        mongoose.connection.close();
      }
    }
});
