const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {
    validationResult
} = require('express-validator');
const {
    validationBulder
} = require('../util/util');

let userEmail;

exports.loginForm = (req, res, next) => {
    renderLoginForm(req, res);
};

exports.signupForm = (req, res, next) => {
    renderSignup(req, res);
};

exports.postLogin = async (req, res, next) => {
    validationBulder(req);
    const email = req.body.email;
    const password = req.body.password;

    userEmail = email; // later could use this for updating user info

    try {
        let user = await User.findOne({
            email: email
        })
        if (user && await user.compare(password)) {
            req.session.userLevel = 1;
            req.session.user = user;
            req.session.save(err => {
                err && console.log(err);
                res.redirect('/');
            });
        } else {
            req.flash('message', {
                class: 'error',
                text: 'Invalid email or password.'
            });
            renderLoginForm(req, res, {
                email: email
            });
        }
    } catch (e) {
        next(e);
    }
};

exports.postSignup = async (req, res, next) => {
    const changes = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        lookingForPets: req.body.lookingForPets,
        pet_breed: req.body.breed,
        pet_size: req.body.size,
        // pet_activity_level: req.body.activityLevel,
        // pet_fenced_yard: req.body.fenced_yard == "Yes" ? true : false,
        pet_gender: req.body.gender,
        pet_age: req.body.age
    }

    if (validationResult(req).isEmpty()) {
        (new User({
            ...changes,
            cart: {
                items: []
            }
        })).save();
        req.flash('message', {
            class: 'success',
            text: 'User Created'
        });
        res.redirect('/login');
    } else {
        console.log("failed validation");
        req.flash('message', {
            class: 'error',
            text: 'Failed Validation'
        });
        validationBulder(req);
        renderSignup(req, res, changes);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        err && console.log(err);
        res.redirect('/');
    });
};

exports.getEditForm = (req, res, next) => {
    User.findOne({
            email: userEmail
        })
        .then(user => {
            if (!user) {
                req.flash('message', 'No account found with this email');
                return res.redirect('/');
            }

            const searchParams = {
                age: user.pet_age,
                breed: user.pet_breed,
                size: user.pet_size,
                gender: user.pet_gender
            };

            const page = {
                title: "Edit User",
                path: "/editUser",
                style: ["pretty", "form"],
                message: req.flash('message'),
                user: user
            }

            res.render('auth/edit', {
                page: page,
                searchParams: searchParams
            });
        })
        .catch(err => console.log(err))

}

exports.postEditForm = (req, res, next) => {
   
    User.findOneAndUpdate({email: userEmail}, {
        name: req.body.name,
        lookingForPets: req.body.lookingForPets,
        pet_breed: req.body.breed,
        pet_size: req.body.size,
        pet_gender: req.body.gender,
        pet_age: req.body.age
    })
    .then(foundDoc => {
        console.log("updating succesfully!");
        res.redirect('/');
    })
    .catch(err => console.log(err));
}


function renderSignup(req, res, data = {
    name: '',
    email: ''
}) {
    const searchParams = {
        required: false
    };
    const page = {
        title: "Sign Up",
        path: "/signup",
        style: ["pretty", "form"],
        message: req.flash('message'),
        data: data
    }
    res.render('auth/signup', {
        page: page,
        searchParams: searchParams
    });
}

function renderLoginForm(req, res, data = {}) {
    const page = {
        title: "Login",
        path: "/login",
        style: ["pretty", "form"],
        message: req.flash('message')[0] || null,
        data: data
    }
    res.render('auth/login', {
        page: page
    });
}