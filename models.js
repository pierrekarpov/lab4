var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  // fields are defined here
  "name": String,
  "username": String,
  "password": String,
  "email": String,
  "imageURL": String
});
exports.User = Mongoose.model('User', UserSchema);



var QuestSchema = new Mongoose.Schema({
  "title": String,
  "description": String,
  "level": Number,
  "deadline": Date,
  "takenBy": {type: Mongoose.Schema.Types.ObjectId,  ref: 'User', default: new Mongoose.Types.ObjectId},
  "completed": Boolean
});
exports.Quest = Mongoose.model('Quest', QuestSchema);



var ItemSchema = new Mongoose.Schema({
  "name": String
});
exports.Item = Mongoose.model('Item', ItemSchema);



var GameSchema = new Mongoose.Schema({
  "castleHealth": Number,
  "monsterHealth": Number,
  "items": [{type: Mongoose.Schema.Types.ObjectId,  ref: 'Item', default: new Mongoose.Types.ObjectId}]
});
exports.Game = Mongoose.model('Game', GameSchema);



var CastleSchema = new Mongoose.Schema({
  "name": String,
  "admin": {type: Mongoose.Schema.Types.ObjectId,  ref: 'User', default: new Mongoose.Types.ObjectId},
  "members": [{type: Mongoose.Schema.Types.ObjectId,  ref: 'User', default: new Mongoose.Types.ObjectId}],
  "quests": [{type: Mongoose.Schema.Types.ObjectId,  ref: 'Quest', default: new Mongoose.Types.ObjectId}],
  "game": {type: Mongoose.Schema.Types.ObjectId,  ref: 'Game', default: new Mongoose.Types.ObjectId}
});
exports.Castle = Mongoose.model('Castle', CastleSchema);
