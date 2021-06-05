const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = new Schema(
    {
        isbn: {type: Number, required: true},
        title:{type: String, required: true},
        subtitle:{type: String},
        author:{type: String, required: true},
        published:{type: Date},
        publisher:{type: String},
        pages:{type: Number},
        description:{type: String, required: true},
        website:{type: String},
        price:{type: Number, required: true},
        image:{type: String, required: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    }
);

Book.methods.isOwner=function(userId){
  return this.userId?(this.userId._id.toString()===userId.toString()):true; //if an object does not have an owner be permissive
}

Book.statics.compareID = function(b) {
  return b2=>{return b._id.toString()===(b2.bookId?b2.bookId:b2._id).toString();}
};

Book.statics.compareISBN = function(b) {
    return b2=>{console.log('comparing', b,b2);return b.isbn===b2.isbn;}
  };

Book.pre('save', function() {
  console.log('Saving', this.title);
});

module.exports = mongoose.model('Book', Book);