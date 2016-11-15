
/*
 * GET home page.
 */

 var models = require('../models');

exports.view = function(req, res){

  models.Quest.find()
   .populate('takenBy')
   .exec(function(err, quests){
        quests.forEach(function(quest){
          //console.log(quest);
          console.log(quest.title + " was taken by " + quest.takenBy.name);
        });
   });

  // models.User
  //   .find()
  //   .exec(afterQuery);
  //
  // function afterQuery(err, users) {
  //   if(err) console.log(err);
  //   console.log(users[0]);
  // };

  res.render('index', {
    'projects' : [
      {
        'name': 'Waiting in Line',
        'image': 'lorempixel.people.1.jpeg',
        'id': 'project1'
      },
      {
        'name': 'Needfinding',
        'image': 'lorempixel.city.1.jpeg',
        'id': 'project2'
      },
      {
        'name': 'Prototyping',
        'image': 'lorempixel.technics.1.jpeg',
        'id': 'project3'
      }
    ]
  });
};
