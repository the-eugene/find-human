const router = require('express').Router();
const search = require('../controllers/search');
const isUser=require('../middleware/isUser'); 

router.get('/humans', isUser, search.getHumans);
router.post('/humans', isUser, search.postHumans);
router.get('/pets', isUser, search.getPets);
router.post('/pets', isUser, search.postPets);

//router.get('/book/:isbn',home.getProductDetail);


module.exports = router;