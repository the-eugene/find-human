const sgMail = require('@sendgrid/mail');
const User=require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (req, res, next)=>{
    console.log("Email Form Submitted")
    var userTo=await User.findById(req.body.mailto);
    if(userTo!=null){
        var msg={
            to:         userTo.email,
            from:       req.user.email,
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
}

exports.mailForm=(req, res, next)=>{
    const page={
        title:"Send a Message",
        path: "/email",
        style:["pretty","form"]
    }

    res.render('email/form.ejs',{page:page, mailto:req.params.userid})
}