const Book=require('../models/book');
const { validationResult } = require('express-validator');
const {validationBulder} = require('../util/util');

exports.editBook=async (req, res, next) => {
    try{
    let book = req.params.isbn?await Book.findOne({isbn:req.params.isbn}):false;
    if ((!book)&&req.params.isbn){
        console.log("Book not found");
        next();
    } else renderBookEdit(req,res,book);
    } catch(e) {next(e);}
};

exports.submitBook=async (req, res, next) => {
    const changes={
        "isbn": req.body.isbn,
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "author": req.body.author,
        "description": req.body.description,
        "price": req.body.price,
        "image": req.body.image
      }
    var book = req.params.isbn?await Book.findOne({isbn:req.params.isbn}):null;
    if(!book){
        book=new Book(changes);
        book.userId=req.user;
    } else {
        Object.assign(book,changes);
        if(!book.userId) book.userId=req.user; //take ownership if none was assigned
    }
    if (validationResult(req).isEmpty() && book.isOwner(req.user._id)){
        book.save();
        res.redirect('/book/'+book.isbn);
    } else {
        if (!book.isOwner(req.user._id)){
            console.log('User does not have ownership');
            req.flash('message', {class:'error',text:'You do not have permission to edit this book'});
        } else {
        console.log("failed validation");
        req.flash('message', {class:'error',text:'Failed Validation'});
        validationBulder(req);
        }
        renderBookEdit(req,res,book);
    }
};

exports.deleteBook=async (req, res, next) => {
    try{
        await Book.deleteOne({ isbn: req.body.isbn, userId: req.user._id });
        res.redirect('/');
    } catch(e) {next(e);}
}

function renderBookEdit(req,res, book){
    const page={
        title:"Edit Book",
        path: "/admin/add-book",
        style:["pretty","form"],
        message: req.flash('message')
    }
    res.render('admin/editBook.ejs',{page:page, book: book});
}