exports.viewProject = function(req, res) {
  // Controller code goes here (for controller viewProject)
  var name = req.params.name;
  console.log('name is: ' + name);
  res.render('project', {
    'projectName': name
  });
};
