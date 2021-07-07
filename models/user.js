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
  lookingForPets: {
    type: Boolean,
    required: false
  },
  pet_breed: {
    type: String,
    required: false
  },
  pet_size: {
    type: String,
    required: false
  },
  pet_gender: {
    type: String,
    required: false
  },
  pet_age: {
    type: String,
    required: false
  }
});

User.methods.compare = function (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', User);