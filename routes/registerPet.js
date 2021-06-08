const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-pet => GET
router.get('/add-pet', isAuth, adminController.getAddpet);

// /admin/pets => GET
router.get('/pets', isAuth, adminController.getpets);

// /admin/add-pet => POST
router.post(
    '/add-pet',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('imageUrl').isURL(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postAddpet
  );

router.get('/edit-pet/:petId', isAuth, adminController.getEditpet);

router.post(
    '/edit-pet',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('imageUrl').isURL(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postEditpet
  );

router.post('/delete-pet', isAuth, adminController.postDeletepet);

module.exports = router;