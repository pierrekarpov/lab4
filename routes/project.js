exports.viewProject = function(req, res) {
  // Controller code goes here (for controller viewProject)
  var name = req.params.name;
  console.log('name is: ' + name);
  res.render('project', {
    'projectName': name
  });

  testDB(req);
};

function testDB(req) {
  // var mongoose = req.app.locals.mongoose;
  // mongoose.connect('mongodb://localhost/test');
  // var db = req.app.locals.db;

  var Kitten = req.app.locals.Kitten;



  // var projectCat2 = new Kitten({ name: 'Project:cat2' });
  // projectCat2.save(function (err, silence) {
  //   if (err) return console.error(err);
  //   Kitten.find(function (err, kittens) {
  //     if (err) return console.error(err);
  //     console.log(kittens);
  //   });
  // });

  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log("In project.js");
    console.log(kittens);
  });
};
