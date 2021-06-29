const User = require('../models/user');
const Pet = require('../models/pet');
const {
    getDogByBreed,
    getBreedImageByImageId
} = require('../services/pets');

// for pagination
const NUMBER_PER_PAGE = 2;

exports.getHumans = (req, res, next) => {
    const currentPage = +req.query.page || 1; // get the current page the user is viewing
    let totalHuman;

    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    User.find({
            lookingForPets: true
        })
        .countDocuments()
        .then(numberOfHuman => {
            totalHuman = numberOfHuman;
            return User.find({
                    lookingForPets: true
                })
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/humans', {
                'data': data,
                page: page,
                searchParams: {},
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalHuman,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: Math.ceil(totalHuman / NUMBER_PER_PAGE)
                }
            });
        });
};

exports.postHumans = (req, res, next) => {
    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    let searchParams = { lookingForPets: true }
    let filterParams = { lookingForPets: true }
    if (req.body.breed !== "") {        
        searchParams.pet_breed = req.body.breed;
        filterParams.breed = req.body.breed;
    }
    if (req.body.size !== "") {
        searchParams.pet_size = req.body.size;
        filterParams.size = req.body.size;
    }
    if (req.body.activityLevel !== "") {
        searchParams.pet_activity_level = req.body.activityLevel;
        filterParams.activityLevel = req.body.activityLevel;
    }
    if (req.body.gender !== "") {
        searchParams.pet_gender = req.body.gender;
        filterParams.gender = req.body.gender;
    }
    if (req.body.fenced_yard !== "") {
        searchParams.pet_fenced_yard = req.body.fenced_yard == "Yes" ? true : false;
        filterParams.fenced_yard = req.body.fenced_yard == "Yes" ? true : false;
    }
    if (req.body.age !== "") {
        searchParams.pet_age = req.body.age;
        filterParams.age = req.body.age;
    }

    User.find(searchParams)
        .then(data => {
            console.log("User Find results: " + data);
            res.render('search/humans',
                {
                    'data': data,
                    searchParams: filterParams,
                    page: page
                });
        });
};

exports.getPets = async (req, res, next) => {
    const currentPage = +req.query.page || 1; // get the current page the user is viewing
    let totalPets;

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

    Pet.find()
        .countDocuments()
        .then(numberOfPets => {
            totalPets = numberOfPets;
            return Pet.find()
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/pets', {
                'data': data,
                page: page,
                searchParams: {},
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalPets,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: Math.ceil(totalPets / NUMBER_PER_PAGE)
                }
            });
        });
};

exports.postPets = (req, res, next) => {
    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

    searchParams = {}
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
        .then(data => {
            res.render('search/pets', {
                'data': data,
                page: page,
                searchParams: searchParams
            });
        });
};

exports.getBreedDetails = async (req, res, next) => {
    const {
        breed
    } = req.params;
    if (!breed) res.redirect("/search/pets");

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "details"]
    };

    const breedInfo = await getDogByBreed(breed);
    const src = await getBreedImageByImageId(breedInfo.reference_image_id);

    if (breedInfo && breedInfo.name) {
        res.render('search/pets/breedDetails', {
            breedInfo: breedInfo,
            page: page,
            src: src
        });
    } else {
        res.redirect("/search/pets");
    }
}


exports.getPetDetails = async (req, res, next) => {
    const {
        petId
    } = req.params;
    if (!petId) res.redirect("/search/pets");

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "details"]
    };

    Pet.findById(petId)
        .then(petInfo => {
            if (petInfo && petInfo.name) {
                return res.render('search/pets/petDetails', {
                    dog: petInfo,
                    page: page
                });
            } else {
                return res.redirect("/search/pets");
            }
        });
}