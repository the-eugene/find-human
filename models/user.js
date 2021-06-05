const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Book=require('../models/book');

const Schema = mongoose.Schema;
const User = new Schema({
  name: {
    type: String,
    required: true
  },
  
  level: {
    type: Number,
    required: true,
    default: 1
  },
  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  cart: {
    items: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

User.methods.addToCart = function(book) {
  let cartIdx = this.cart.items.findIndex(Book.compareID(book)); 
  if (cartIdx<0){
    cartIdx=this.cart.items.length;
    this.cart.items.push({bookId:book._id, quantity: 0});
  }

  this.cart.items[cartIdx].quantity++;
  return this.save();

}

User.methods.deleteFromCart = function(id) {
  let item = this.cart.items.find(Book.compareID({_id:id})); 
    if(--item.quantity<1){
      this.cart.items=this.cart.items.filter(i=>{return i!==item});
    }
    return this.save();
  };

User.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

User.methods.compare = function(password){
  return bcrypt.compare(password,this.password);
}

module.exports = mongoose.model('User', User);