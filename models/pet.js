const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Pet = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  activityLevel: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specialNeeds: { // not required
    type: String,
  },
  adoptionFee: { 
    type: Number,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Pet', Pet);