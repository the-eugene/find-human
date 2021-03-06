const Pet = require('../models/pet');
const { BreedsApi } = require('../services/pets');
const { validationResult } = require('express-validator');
const { validationBulder } = require('../util/util');

exports.getAddPet = async (req, res, next) => {
    const page = {
        title: "Pet Registration",
        path: "/admin/editRegistration",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }

    const breeds = await BreedsApi.getDogBreeds();

    res.render('admin/editRegistration', {
        page,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        breeds: breeds,
        pet: {},
        searchParams: { required: true }
    });
};

exports.getPets = (req, res, next) => {
    const page = {
        title: "My Pets",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }
    
    Pet.find({
            ownerId: req.user._id
        })
        .then(pets => {
            res.render('admin/edit-pet', {
                page,
                pets: pets,
                title: 'pets',
                path: '/admin/edit-pet'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAddPet = (req, res, next) => {
    const { imageUrl, name, breed, size, gender, age, specialNeeds, description } = req.body;  
    const errors = validationBulder(req);
    
    const searchParams = { 
        required: true,
        breed: breed,
        size: size,
        gender: gender,
        age: age
    };

    const page = {
        title: "Pet Registration",
        path: "/admin/add-pet",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }

    if (errors.length != 0) {
        console.log(errors);
        return res.status(422).render('admin/editRegistration', {
            page,
            editing: false,
            hasError: true,
            errorMessage: errors[0],
            validationErrors: [],
            pet: {
                imageUrl: imageUrl,
                name: name,
                breed: breed,
                size: size,
                gender: gender,
                age: age,
                specialNeeds: specialNeeds,                
                description: description,
                message: req.flash('message')
            },
            searchParams: searchParams
        });
    }

    const pet = new Pet({
        page,
        imageUrl: imageUrl,
        name: name,
        breed: breed,
        size: size,
        gender: gender,
        age: age,
        specialNeeds: specialNeeds,        
        description: description,
        ownerId: req.user._id
    });
    pet
        .save()
        .then(result => {
            console.log('Created Pet');

            let imageFile;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                // console.log('no files were uploaded');
                return res.redirect('/admin/pets');
            }

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            imageFile = req.files.imageFile;
            uploadPath = __dirname + '/public/images/' + imageFile.name;
            console.log('upload path', __dirname + '/public/images/' + imageFile.name);
            console.log('created pet result', result);

            // Use the mv() method to place the file somewhere on your server
            imageFile.mv(uploadPath, (err) => {
                if (err)
                return res.status(500).send(err);

                res.send('File uploaded!');
            });

            res.redirect('/admin/pets');
            
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditPet = async (req, res, next) => {
    const page = {
        title: "Edit Pet",
        path: "/admin/editRegistration",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }

    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const petId = req.params.petId;
    const breeds = await BreedsApi.getDogBreeds();
    
    Pet.findById(petId)
        .then(pet => {
            if (!pet) {
                return res.redirect('/');
            }
            console.log(pet);
            res.render('admin/editRegistration', {
                page,
                editing: editMode,
                pet: pet,
                breeds: breeds,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
                searchParams: {
                    required: true,
                    breed: pet.breed,
                    size: pet.size,
                    gender: pet.gender,
                    age: pet.age
                }
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditPet = async (req, res, next) => {
    const petId = req.body.petId;
    const updatedImageUrl = req.body.imageUrl;
    const updatedname = req.body.name;
    const updatedBreed = req.body.breed;
    const updatedSize = req.body.size;
    const updatedGender = req.body.gender;
    const updatedAge = req.body.age;
    const updatedSpecialNeeds = req.body.specialNeeds;    
    const updatedDesc = req.body.description;
    
    const page = {
        title: "Edit Pet",
        path: "/admin/editRegistration",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }

    const searchParams = { 
        required: true,
        breed: updatedBreed,
        size: updatedSize,
        gender: updatedGender,
        age: updatedAge
    };

    console.log(searchParams);

    const errors = validationBulder(req);

    if (errors.length != 0) {
        const page = {
            title: "Edit Pet",
            path: "/admin/editRegistration",
            style: ["pretty", "form", "pets"],
            message: req.flash('message')
        }
        const breeds = await BreedsApi.getDogBreeds();
        
        Pet.findById(petId)
            .then(pet => {
                if (!pet) {
                    return res.redirect('/');
                }
                console.log(pet);
                res.render('admin/editRegistration', {
                    page,
                    editing: true,
                    pet: pet,
                    breeds: breeds,
                    hasError: false,
                    errorMessage: null,
                    validationErrors: [],
                    searchParams: {
                        required: true,
                        breed: pet.breed,
                        size: pet.size,
                        gender: pet.gender,
                        age: pet.age,

                    }
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    } else {


    Pet.findById(petId)
        .then(pet => {
            if (pet.ownerId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            pet.imageUrl = updatedImageUrl;
            pet.name = updatedname;
            pet.breed = updatedBreed;
            pet.size = updatedSize;
            pet.gender = updatedGender;
            pet.age = updatedAge;
            pet.specialNeeds = updatedSpecialNeeds;            
            pet.description = updatedDesc;

            return pet.save().then(result => {
                console.log('UPDATED PET!');
                res.redirect('/admin/pets');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}};

exports.postDeletePet = (req, res, next) => {
    const petId = req.body.petId;
    Pet.deleteOne({
            _id: petId,
            ownerId: req.user._id
        })
        .then(() => {
            console.log('DESTROYED PET REGISTRATION');
            res.redirect('/admin/pets');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

