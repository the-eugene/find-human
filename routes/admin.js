const router = require('express').Router();
const { body } = require('express-validator');
const admin = require('../controllers/admin');

const validEditPage=[
    body('isbn').trim().isISBN().withMessage('Please enter a valid ISBN'),
    body('title').trim().isString().isLength({min: 3}),
    body('subtitle').trim().isString(),
    body('author').trim().isString().notEmpty(),
    body('description').trim().isString().notEmpty(),
    body('price').trim().isFloat({gt:0}),
    body('image').trim().isURL()
];

//for now all admin functions require just user access
const isUser=require('../middleware/isUser'); 

router.get('/add-book', isUser, admin.editBook);
router.get('/edit-book/:isbn', isUser, admin.editBook);

router.post('/edit-book/:isbn',validEditPage, isUser, admin.submitBook);
router.post('/edit-book',validEditPage, isUser, admin.submitBook);

router.post('/delete-book', isUser, admin.deleteBook);

module.exports = router;