const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Favorite = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  petId: {type: Schema.Types.ObjectId, ref: 'Pet', required: true}
});

module.exports = mongoose.model('Favorite', Favorite);