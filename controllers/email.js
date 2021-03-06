const sgMail = require('@sendgrid/mail');
const User=require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { validationBulder } = require('../util/util');


exports.sendEmail = async (req, res, next)=>{
    console.log("Email Form Submitted")
    const errors = validationBulder(req);
    if(errors.length==0)
        {
    var userTo=await User.findById(req.body.mailto);
    if(userTo!=null){
        var msg={
            to:         userTo.email,
            from:       'wil20121@byui.edu', //req.user.email, //does not work, sender emails have to be certified
            'reply-to':   req.user.email,
            subject:    req.body.mailsubject,
            text:       req.body.mailmessage
        };
        console.log('Message Sent:', msg);
        try{
            await sgMail.send(msg);
            req.flash('message', {class:'success',text:'Message Sent'});
        } catch (e){
            console.log(e);
            req.flash('message', {class:'error',text:'Message Not Sent'});
        }
    } else {req.flash('message', {class:'error',text:'No destination'});}
    
    res.redirect('/');
    } else {
        const page={
            title:"Send a Message",
            path: "/email",
            style:["pretty","form"],
            message: req.flash('message')
        }
    
        res.render('email/form.ejs',{page:page, mailto:req.params.userid})
    }

}

exports.mailForm=(req, res, next)=>{
    const page={
        title:"Send a Message",
        path: "/email",
        style:["pretty","form"]
    }

    res.render('email/form.ejs',{page:page, mailto:req.params.userid})
}