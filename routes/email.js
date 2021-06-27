const router = require('express').Router();
const { body } = require('express-validator');
const mail = require('../controllers/email');

const validEmail=[
    body('mailsubject').trim().notEmpty().withMessage("A subject is required"),
    body('mailmessage').trim().notEmpty().withMessage("A message is required"),
    body('mailurl').trim().isURL()
]

//for now all admin functions require just user access
const isUser=require('../middleware/isUser'); 
router.get('/:userid',isUser,mail.mailForm);
router.post('/',validEmail, isUser, mail.sendEmail);
module.exports = router;