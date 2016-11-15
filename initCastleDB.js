var mongoose = require('mongoose');
var models = require('./models');
var castles_json = require('./data/castles.json');
var gameIDs = [];
var castlesIDs = [];

var mongodbUri = 'mongodb://heroku_qrb8bt7t:k9ki1b3bnvg7tvnpf45cssn0f6@ds041583.mlab.com:41583/heroku_qrb8bt7t';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //drop table
  models.Game
      .find()
      .remove()
      .exec(function(){
        console.log("Game table dropped");
        models.Castle
            .find()
            .remove()
            .exec(function() {
              console.log("Castle table dropped");
              addGames();
            });
        });

  //add castles and game
  addGames = function() {
    var i = castles_json.length;
    castles_json.forEach(function(c){
      var game = new models.Game(c.game);
      game.save(function(err, game) {
          if (err) console.log(err);
          gameIDs.push(game._id);
          i--;
          if(i <= 0) {
            addCastles();
          }
      });
    });
  }

  addCastles = function() {
    var i = castles_json.length;
    castles_json.forEach(function(c){
      var castle = new models.Castle({
        "name": c.name
      });
      castle.save(function(err, castle) {
          if (err) console.log(err);
          castlesIDs.push(castle._id);
          i--;
          if(i <= 0) {
            printCastles();
          }
      });
    });
  }


  //print statements
  printCastles = function() {
    console.log("Game IDs");
    console.log(gameIDs);
    console.log("Castle IDs");
    console.log(castlesIDs);

    // models.Castle.find()
    //  .populate('game')
    //  .exec(function(err, castles){
    //       if(err) console.log(err);
    //       if(castles == null) {
    //         console.log("Castles table is empty");
    //         console.log(castles);
    //       } else {
    //         castles.forEach(function(castle){
    //           if(castles.game == null) {
    //             console.log(castle.name + " has no game lol");
    //           } else {
    //             console.log(castle.name + " is at " + castle.game.castleHealth + " hp and its monster is at " + castle.game.monsterHealth + " hp");
    //           }
    //         });
    //       }
    //       closeDB();
    //  });
    closeDB();
  }
  //close db
  closeDB = function() {
    mongoose.connection.close();
  }
});
