const Book = require('../models/book');
const User = require('../models/user');
const Pet = require('./pet');

const fs=require('fs');
const path = require('path');
const { mongooseOptions } = require('../config');
const base=path.dirname(process.mainModule.filename);
const dataFile=path.join(base,'data','books.json');
const dataFileUsers=path.join(base,'data','humans.json');
const dataFilePets=path.join(base,'data','pets.json');

async function readJSONFile(file){
    try{
        const contents = await fs.promises.readFile(file);
        return JSON.parse(contents);
    } catch (err){
        console.error(err);
        return [];
    }
}

exports.loadLibrary = function(userId=null){
    readJSONFile(dataFile).then((lib)=>{        
        lib.forEach(b => {
            let newBook=new Book(b);
            newBook.userId=userId;
            newBook.save();
        });
    });

    let users = [];
    readJSONFile(dataFileUsers).then((lib)=>{
        let i = 0;
        lib.forEach(u => {
            let newUser=new User(u);           
            newUser.save();
            users[i++] = newUser;
        });
    });

    readJSONFile(dataFilePets).then((lib)=>{
        let i = 0;
        lib.forEach(p => {
            p.ownerId = users[i++]._id;
            let newPet=new Pet(p);           
            newPet.save();
        });
    });
}