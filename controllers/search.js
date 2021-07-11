const User = require('../models/user');
const Pet = require('../models/pet');
const {
    getDogByBreed,
    getBreedImageByImageId,
    getBreedsByTemperament
} = require('../services/pets');

// for pagination
const NUMBER_PER_PAGE = 2;

exports.getHumans = (req, res, next) => {
    const currentPage = +req.query.page || 1; // get the current page the user is viewing
    let totalHuman;

     // if req.query.page == undefined, means the user clicks on "Find Pets" in the nav bar or the "Reset" button
     if (req.query.page == undefined) {
        // set the session to null 
        req.session.humansSearchParams = null;
    }

    let searchParams;
     let filterParams = { lookingForPets: true };

    // check whether req.session.searchParams is null or not
    if (req.session.humansSearchParams == null || req.session.humansSearchParams == undefined) {
        // set searchParams to empty when the page just gets loaded except that we still only want see humans who are looking for pets
        searchParams = { lookingForPets: true };
    } else {
        searchParams = req.session.humansSearchParams;
    }

    if (searchParams.breed) filterParams.pet_breed = searchParams.breed;
    if (searchParams.size) filterParams.pet_size = searchParams.size;
    if (searchParams.gender) filterParams.pet_gender = searchParams.gender;
    if (searchParams.age) filterParams.pet_age = searchParams.age;

    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    User.find(filterParams)
        .countDocuments()
        .then(numberOfHuman => {
            totalHuman = numberOfHuman;
            return User.find(filterParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/humans', {
                'data': data,
                page: page,
                searchParams: {required: false, ...searchParams},
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalHuman,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: totalHuman === 0 ? 1 : Math.ceil(totalHuman / NUMBER_PER_PAGE)
                }
            });
        });
};

exports.postHumans = (req, res, next) => {
    const currentPage = 1; // always start with 1 after searching
    let totalHuman;

    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    let searchParams = {
        lookingForPets: true
    }
    let filterParams = { ...searchParams };

    if (req.body.breed) {
        filterParams.pet_breed = req.body.breed;
        searchParams.breed = req.body.breed;
    }
    if (req.body.size) {
        filterParams.pet_size = req.body.size;
        searchParams.size = req.body.size;
    }
    if (req.body.gender) {
        filterParams.pet_gender = req.body.gender;
        searchParams.gender = req.body.gender;
    }
    if (req.body.age) {
        filterParams.pet_age = req.body.age;
        searchParams.age = req.body.age;
    }

    User.find(filterParams)
        .countDocuments()
        .then(numberOfHuman => {
            totalHuman = numberOfHuman;
            return User.find(filterParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            req.session.humansSearchParams = searchParams;

            res.render('search/humans', {
                'data': data,
                searchParams: {...searchParams, required: false},
                page: page,
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalHuman,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: totalHuman === 0 ? 1 : Math.ceil(totalHuman / NUMBER_PER_PAGE)
                }
            });
        });
};

exports.getPets = async (req, res, next) => {
    const currentPage = +req.query.page || 1; // get the current page the user is viewing, set to 1 if it is undefined
    let totalPets;

    // if req.query.page == undefined, means the user clicks on "Find Pets" in the nav bar or the "Reset" button
    if (!req.query.page) {
        // set the session to null 
        req.session.petsSearchParams = null;
    }

    let searchParams = {};
    let breeds = [];

    // check whether req.session.searchParams is null or not
    if (req.session && req.session.petsSearchParams) {
        if (req.session.petsSearchParams.activityLevel) {
            const temperament = req.session.petsSearchParams.activityLevel;
            breeds = await getBreedsByTemperament(temperament);
        }
        searchParams = {...req.session.petsSearchParams};
        if (searchParams.hasOwnProperty("activityLevel")) delete searchParams.activityLevel;
    }

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

      Pet.find({...(breeds && breeds.length && {breed: {$in: [...breeds]}}), ...searchParams})
      .countDocuments()
        .then(numberOfPets => {
            totalPets = numberOfPets;
            return Pet.find({...(breeds && breeds.length && {breed: {$in: [...breeds]}}), ...searchParams})
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/pets', {
                'data': data || [],
                page: page,
                searchParams: {...req.session.petsSearchParams},
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalPets,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: totalPets === 0 ? 1 : Math.ceil(totalPets / NUMBER_PER_PAGE)
                }
            });
        });
};

exports.postPets = async (req, res, next) => {
    const currentPage = 1; // always start with 1 after searching
    let totalPets;
    let temperament = "";

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

    searchParams = {}
    let breeds = [];

    if (req.body.activityLevel) {
        temperament = req.body.activityLevel;
        breeds = await getBreedsByTemperament(temperament);
    }

    if (req.body.breed) searchParams.breed = req.body.breed;
    if (req.body.size) searchParams.size = req.body.size;
    if (req.body.gender) searchParams.gender = req.body.gender;
    if (req.body.age) searchParams.age = req.body.age;

    Pet.find({...(breeds && breeds.length && {breed: {$in: [...breeds]}}), ...searchParams})
      .countDocuments().then(count => {
        totalPets = count;

        return Pet.find({...(breeds && breeds.length && {breed: {$in: [...breeds]}}), ...searchParams})
            .skip((currentPage - 1) * NUMBER_PER_PAGE)
            .limit(NUMBER_PER_PAGE);
    })
        .then(data => {
            // store the petsSearchParams into Session to make pagination work
            req.session.petsSearchParams = {activityLevel: temperament,...searchParams};

            res.render('search/pets', {
                'data': data,
                page: page,
                searchParams: {activityLevel: temperament, required: false, ...searchParams},
                pageObject: {
                    currentPage: currentPage,
                    hasNextPage: NUMBER_PER_PAGE * currentPage < totalPets,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage + 1,
                    previousPage: currentPage - 1,
                    lastPage: totalPets === 0 ? 1 : Math.ceil(totalPets / NUMBER_PER_PAGE)
                }
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
    if (breedInfo && breedInfo.name) {
        res.render('search/pets/breedDetails', {
            breedInfo: breedInfo,
            page: page
        });
    } else {
        res.redirect("/search/pets");
    }
}

exports.getPetImage = async (req, res) => {
    const {imageId} = req.params;
    if (imageId) {
        const src = await getBreedImageByImageId(imageId);
        res.send({src: src});
    } else {
        res.send({src: ""});
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