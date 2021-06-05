const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');

const router = express.Router();
router.get('/login', authController.loginForm);
router.get('/signup', authController.signupForm);

router.post('/login',[
   body('email','Invalid Email Address').trim().isEmail().bail().normalizeEmail(),
   body('password', 'Password should have 5 letters or numbers.').trim().isLength({ min: 5 }).isAlphanumeric(),
],authController.postLogin);

router.post('/signup',[
    body('name').trim().notEmpty().withMessage("Enter your name"),
    body('email').trim().isEmail().withMessage('Enter a valid email address').bail().normalizeEmail()
        .custom(async (eml)=>{
            if (await require('../models/user').findOne({email: eml})){
                throw new Error('Email Exists, try logging in instead');
            }
            return true;
        }),
    body('password1')
        .trim()
        .isLength({ min: 5 }).withMessage("Password has to be at least 5 characters").bail()
        .isAlphanumeric().withMessage("Password can only contain letters and numbers"),
    body('password2').trim().custom((v, { req }) => {
        if (v !== req.body.password1) {
            throw new Error('Passwords don\'t match');
        }
        return true;
    })
], authController.postSignup);

router.all('/logout', authController.logout);
module.exports = router;