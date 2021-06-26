const router = require('express').Router();
const home = require('../controllers/home');
const isUser=require('../middleware/isUser'); 

router.get('/', home.getHome);
// router.get('/products', home.getProducts);
// router.get('/book/:isbn',home.getProductDetail);

// router.post('/cart',isUser,home.AddCart); 
// router.get('/cart',isUser, home.getCart);

// router.post('/cart-delete-item', isUser, home.delBookCart);

// router.post('/create-order', isUser, home.postOrder);
// router.get('/orders', isUser,home.getOrders);

module.exports = router;