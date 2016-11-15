//TODO init.js file
// maybe make a js file to init db with functions like
// CreateCaslte(name, memebers), etc that we will actually use later on anyway

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

    var users_to_save_count = users_json.length;
    var quests_to_save_count = quests_json.length;
    // var userquests_to_save_count = quests_json.length;

    var userIDs = [];
    var questIDs = [];

    var notAddedUserToQuestYet = true;
    var notPopulatedQuestsYet = true;

    // Step 2: Remove all existing documents
    populateUsers();
    //populateQuests();
    //addUsersToQuests();

    function populateUsers() {
        models.User
            .find()
            .remove()
            .exec(onceClearUser); // callback to continue at

        function onceClearUser(err) {
            if (err) console.log(err);


            for (var i = 0; i < users_json.length; i++) {
                var json = users_json[i];
                var user = new models.User(json);

                user.save(function(err, user) {
                    if (err) console.log(err);

                    userIDs.push({
                      "id": user._id,
                      "username": user.username
                    });

                    users_to_save_count--;
                    console.log(users_to_save_count + ' users left to save');
                    checkCanClose();
                });
            }
        }
    }


    function populateQuests() {
        notPopulatedQuestsYet = false;
        models.Quest
            .find()
            .remove()
            .exec(onceClearQuest); // callback to continue at


        function onceClearQuest(err) {
            //console.log(userIDs);
            if (err) console.log(err);

            for (var i = 0; i < quests_json.length; i++) {
                var json = quests_json[i];

                var quest = new models.Quest({
                    "title": json.title,
                    "description": json.description,
                    "level": json.level,
                    "deadline": json.deadline,
                    //"takenBy": "",
                    "completed": json.completed
                });

                quest.save(function(err, quest) {
                    if (err) console.log(err);
                    quests_to_save_count--;
                    console.log(quests_to_save_count + ' quests left to save');
                    checkCanClose();
                });

                // for(var j = 0; j < userIDs.length; j++) {
                //   if(userIDs[j].username = json.takenBy) {
                //     var quest = new models.Quest({
                //         "title": json.title,
                //         "description": json.description,
                //         "level": json.level,
                //         "deadline": json.deadline,
                //         "takenBy": userIDs[j].id,
                //         "completed": json.completed
                //     });
                //
                //     quest.save(function(err, quest) {
                //         if (err) console.log(err);
                //         quests_to_save_count--;
                //         console.log(quests_to_save_count + ' quests left to save');
                //         checkCanClose();
                //     });
                //     break;
                //   }
                // }


            }
        }
    }

    // function addUsersToQuests() {
    //   notAddedUserToQuestYet = false;
    //   for (var i = 0; i < quests_json.length; i++) {
    //     var json = quests_json[i];
    //     models.User
    //         .find({username: json.takenBy})
    //         .exec(function(err, users){
    //           if (err) console.log(err);
    //           models.Quest
    //             .find({'title': json.title})
    //             .update({'takenBy': users[0]._id})
    //             .exec(function(err, quests){
    //               if (err) console.log(err);
    //               console.log(quests[0]);
    //               console.log(quests.title + ' taken by ' + users[0]._id);
    //               userquests_to_save_count--;
    //               console.log(userquests_to_save_count + ' userquests left to save');
    //               checkCanClose();
    //             })
    //         });
    //   }
    // }

    function checkCanClose() {
        // The script won't terminate until the
        // connection to the database is closed

        if (users_to_save_count <= 0 && notPopulatedQuestsYet) {
          populateQuests();
        }

        // if(users_to_save_count <= 0 && quests_to_save_count <= 0 && notAddedUserToQuestYet) {
        //   addUsersToQuests();
        // }

        if (users_to_save_count <= 0 && quests_to_save_count <= 0) {
            console.log("DONE!");


            // models.Quest.find()
            //  .populate('takenBy')
            //  .exec(function(err, quest){
            //       console.log(quest.takenBy);
            //  })

            mongoose.connection.close();
        }
    }
});
