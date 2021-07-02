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

     // if req.query.page == undefined, means the user clicks on "Find Pets" in the nav bar or the "Reset" button
     if (req.query.page == undefined) {
        // set the session to null 
        req.session.humansSearchParams = null;
    }

    let searchParams;

    // check whether req.session.searchParams is null or not
    if (req.session.humansSearchParams == null || req.session.humansSearchParams == undefined) {
        // set searchParams to empty when the page just gets loaded except that we still only want see humans who are looking for pets
        searchParams = { lookingForPets: true };
    } else {
        searchParams = req.session.humansSearchParams;
    }

    const page = {
        title: "Search Humans",
        path: "/search/humans",
        style: ["pretty", "search"]
    }

    User.find(searchParams)
        .countDocuments()
        .then(numberOfHuman => {
            totalHuman = numberOfHuman;
            return User.find(searchParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/humans', {
                'data': data,
                page: page,
                searchParams: searchParams,
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
    let filterParams = {
        lookingForPets: true
    }
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
        .countDocuments()
        .then(numberOfHuman => {
            totalHuman = numberOfHuman;
            return User.find(searchParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            // console.log("User Find results: " + data);

            req.session.humansSearchParams = searchParams;

            res.render('search/humans', {
                'data': data,
                searchParams: searchParams,
                page: page,
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

exports.getPets = async (req, res, next) => {
    const currentPage = +req.query.page || 1; // get the current page the user is viewing, set to 1 if it is undefined
    let totalPets;

    // console.log("req.query.page: " + req.query.page);

    // if req.query.page == undefined, means the user clicks on "Find Pets" in the nav bar or the "Reset" button
    if (req.query.page == undefined) {
        // set the session to null 
        req.session.petsSearchParams = null;
    }

    let searchParams;

    // check whether req.session.searchParams is null or not
    if (req.session.petsSearchParams == null || req.session.petsSearchParams == undefined) {
        // set searchParams to empty when the page just gets loaded 
        searchParams = {};
    } else {
        searchParams = req.session.petsSearchParams;
    }

    const page = {
        title: "Find Pets",
        path: "/search/pets",
        style: ["pretty", "search"]
    }

    Pet.find(searchParams)
        .countDocuments()
        .then(numberOfPets => {
            totalPets = numberOfPets;
            return Pet.find(searchParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            res.render('search/pets', {
                'data': data,
                page: page,
                searchParams: searchParams,
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
    const currentPage = 1; // always start with 1 after searching
    let totalPets;

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

    // console.log(searchParams);

    Pet.find(searchParams)
        .countDocuments()
        .then(numberOfPets => {
            totalPets = numberOfPets;
            return Pet.find(searchParams)
                .skip((currentPage - 1) * NUMBER_PER_PAGE) // skip certain amount of pages for pagination
                .limit(NUMBER_PER_PAGE) // limit the number of pets displaying on each page
        })
        .then(data => {
            // store the petsSearchParams into Session to make pagination work
            req.session.petsSearchParams = searchParams;

            res.render('search/pets', {
                'data': data,
                page: page,
                searchParams: searchParams,
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