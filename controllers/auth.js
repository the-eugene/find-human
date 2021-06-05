const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const {validationBulder} = require('../util/util');

exports.loginForm = (req, res, next) => {
    renderLoginForm(req,res);
};
  
exports.signupForm = (req, res, next) => {
    renderSignup(req,res);
};

exports.postLogin = async (req, res, next) => {
    validationBulder(req);
    const email = req.body.email;
    const password = req.body.password;
    try{
        let user = await User.findOne({ email: email })
        if (user&&await user.compare(password)) {
            req.session.userLevel = user.level;
            req.session.user = user;
            req.session.save(err => {err && console.log(err); res.redirect('/');});
        } else {
            req.flash('message', {class:'error',text:'Invalid email or password.'});
            renderLoginForm(req,res,{email:email});
        }
    } catch(e) {next(e);}
};

exports.postSignup = async (req, res, next) => {
    const changes={
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password1, 12),
    }

    if (validationResult(req).isEmpty()){
        (new User({...changes, cart: { items: [] }})).save();
        req.flash('message', {class:'success',text:'User Created'});
        res.redirect('/login');
    } else {
        console.log("failed validation");
        req.flash('message', {class:'error',text:'Failed Validation'});
        validationBulder(req);
        renderSignup(req,res,changes);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        err && console.log(err);
        res.redirect('/');
    });
};

function renderSignup(req, res, data={name:'', email:''}){
    const page={
        title:"Sign Up",
        path: "/signup",
        style:["pretty","form"],
        message: req.flash('message'),
        data: data
    }
    res.render('auth/signup',{page:page});
}

function renderLoginForm(req, res, data={}){
    const page={
        title:"Login",
        path: "/login",
        style:["pretty","form"],
        message: req.flash('message')[0]||null,
        data: data
    }
    res.render('auth/login',{page:page});
}