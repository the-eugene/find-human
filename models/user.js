const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  petIds: [{petId: {type: Schema.Types.ObjectId, ref: 'Pet', required: true}}],
  favorites: [{petId: {type: Schema.Types.ObjectId, ref: 'Pet', required: true}}]
});

User.methods.compare = function (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', User);