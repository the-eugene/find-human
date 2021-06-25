const Pet = require('../models/pet');
const { getDogBreeds } = require('../services/pets');
const { getDogTemperaments } = require('../services/pets');
const { validationBulder } = require('../util/util');

let gBreeds = [];

const getBreeds = () => {
    getDogBreeds().then(breeds => {
        gBreeds = ['', ...breeds];
    });
};
getBreeds();

exports.getAddPet = (req, res, next) => {
    const page = {
        title: "Pet Registration",
        path: "/admin/editRegistration",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }
    res.render('admin/editRegistration', {
        page,
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        breeds: gBreeds,
        pet: {}
    });
};

exports.getPets = (req, res, next) => {
    const page = {
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
                pageTitle: 'pets',
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
    const imageUrl = req.body.imageUrl;
    const name = req.body.name;
    const breed = req.body.breed;
    const size = req.body.size;
    const gender = req.body.gender;
    const age = req.body.age;
    const specialNeeds = req.body.specialNeeds;
    const description = req.body.description;    
    const errors = validationBulder(req);

    const page = {
        title: "Pet Registration",
        path: "/admin/add-pet",
        style: ["pretty", "form", "pets"],
        message: req.flash('message')
    }

    if (errors.length != 0) {
        console.log(errors);
        return res.status(422).render('admin/edit-pet', {
            page,
            editing: false,
            hasError: true,
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
            res.redirect('/admin/pets');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditPet = (req, res, next) => {
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
                breeds: gBreeds,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditPet = (req, res, next) => {
    const petId = req.body.petId;
    const updatedImageUrl = req.body.imageUrl;
    const updatedname = req.body.name;
    const updatedBreed = req.body.breed;
    const updatedSize = req.body.size;
    const updatedGender = req.body.gender;
    const updatedAge = req.body.age;
    const updatedSpecialNeeds = req.body.specialNeeds;    
    const updatedDesc = req.body.description;

    const errors = validationBulder(req);

    if (errors.length != 0) {
        return res.status(422).render('admin/edit-pet', {
            page,
            pageTitle: 'Edit Pet',
            path: '/admin/edit-pet',
            editing: true,
            hasError: true,
            pet: {
                imageUrl: updatedImageUrl,
                name: updatedname,
                breed: updatedBreed,
                size: updatedSize,
                gender: updatedGender,
                age: updatedAge,
                specialNeeds: updatedSpecialNeeds,                
                description: updatedDesc,
                _id: petId
            },
        });
    }

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
};

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

