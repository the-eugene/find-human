const Book = require('../models/book');

const fs=require('fs');
const path = require('path');
const { mongooseOptions } = require('../config');
const base=path.dirname(process.mainModule.filename);
const dataFile=path.join(base,'data','books.json');

async function readJSONFile(){
    try{
    const contents = await fs.promises.readFile(dataFile);
    return JSON.parse(contents);
    } catch (err){
        console.error(err);
        return [];
    }
}

exports.loadLibrary = function(userId=null){
    readJSONFile().then((lib)=>{
        lib.forEach(b => {
            let newBook=new Book(b);
            newBook.userId=userId;
            newBook.save();
        });
    });
}