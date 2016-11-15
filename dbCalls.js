var models = require('./models');
var success = false;

setSuccessTrue = function() {
  success = true;
}

dropTable = function(table, tableName) {
    console.log('droping table ' + tableName);
    success = false;
    table
        .find()
        .remove()
        .exec(setSuccessTrue());

    while(!success) {} //wait till success (blocks queue but w/e)
    return success;

};
