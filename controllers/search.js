const User = require('../models/user');
const Pet = require('../models/pet');
const {getDogByBreed, getBreedImageByImageId} = require('../services/pets');

exports.getHumans = (req, res, next) => {
    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }
    User.find({ lookingForPets: true })
        .then(data => { res.render('search/humans', { 'data': data, page: page, searchParams: {} }); });
};

exports.postHumans = (req, res, next) => {
    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    let searchParams = { lookingForPets: true }
    if (req.body.pet_breed !== "") {
        searchParams.pet_breed = req.body.pet_breed;
    }
    if (req.body.pet_size !== "") {
        searchParams.pet_size = req.body.pet_size;
    }
    if (req.body.pet_activity_level !== "") {
        searchParams.pet_activity_level = req.body.pet_activity_level;
    }
    if (req.body.pet_gender !== "") {
        searchParams.pet_gender = req.body.pet_gender;
    }
    if (req.body.pet_fenced_yard !== "") {
        searchParams.pet_fenced_yard = req.body.pet_fenced_yard == "Yes" ? true : false;
    }
    if (req.body.pet_age !== "") {
        searchParams.pet_age = req.body.pet_age;
    }
    //console.log(searchParams);
    User.find(searchParams)
        .then(data => {
            res.render('search/humans',
                {
                    'data': data,
                    searchParams: searchParams,
                    page: page
                });
        });
};

exports.getPets = async (req, res, next) => {
    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }
    Pet.find()
        .then(data => { res.render('search/pets', { 'data': data, page: page, searchParams: {} }); });
};

exports.postPets = (req, res, next) => {
    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

    searchParams = { }
    if (req.body.breed !== "") {
        searchParams.breed = req.body.breed;
    }
    if (req.body.size !== "") {
        searchParams.size = req.body.size;
    }
    if (req.body.activityLevel !== "") {
        searchParams.activityLevel = req.body.activityLevel;
    }
    if (req.body.gender !== "") {
        searchParams.gender = req.body.gender;
    }    
    if (req.body.age !== "") {
        searchParams.age = req.body.age;
    }

    console.log(searchParams)
    Pet.find(searchParams)
        .then(data => { res.render('search/pets', { 'data': data, page: page, searchParams: searchParams }); });
};

exports.getBreedDetails = async (req, res, next) => {
    const {breed} = req.params;
    if (!breed) res.redirect("/search/pets");

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "details"]
    };

    const breedInfo = await getDogByBreed(breed);
    const src = await getBreedImageByImageId(breedInfo.reference_image_id);

    if (breedInfo && breedInfo.name) {
        res.render('search/pets/breedDetails', {breedInfo: breedInfo, page: page, src: src });
    } else {
        res.redirect("/search/pets");
    }
}


exports.getPetDetails = async (req, res, next) => {
    const {petId} = req.params;
    if (!petId) res.redirect("/search/pets");

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "details"]
    };

    Pet.findById(petId)
      .then(petInfo => {
          if (petInfo && petInfo.name) {
              return res.render('search/pets/petDetails', {dog: petInfo, page: page});
          } else {
              return res.redirect("/search/pets");
          }
      });
}

