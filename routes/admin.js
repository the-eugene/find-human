const router = require('express').Router();
const { body } = require('express-validator');

//for now all admin functions require just user access

const adminController = require('../controllers/admin');
const isUser = require('../middleware/isUser');

// /admin/add-pet => GET
router.get('/add-pet', isUser, adminController.getAddPet);

// /admin/pets => GET
router.get('/pets', isUser, adminController.getPets);

// /admin/add-pet => POST
router.post(
  '/add-pet',
  [
    body('imageUrl').notEmpty().isURL().withMessage('Please enter an image URL'),
    body('name').notEmpty().isString().isLength({ min: 3 }).trim().withMessage('Please enter the name of your dog'),
    body('breed').notEmpty().withMessage('Please enter the breed of your dog'),
    body('age').notEmpty().withMessage('Please enter the age of your dog'),
    body('gender').notEmpty().withMessage('Please enter the gender of your dog'),
    body('size').notEmpty().withMessage('Please enter the size of your dog'),
    body('description').notEmpty().isLength({ min: 5, max: 400 }).trim().withMessage('Please enter a description'),
    body('specialNeeds'),
  ],
  isUser,
  adminController.postAddPet
);

router.get('/edit-pet/:petId', isUser, adminController.getEditPet);

router.post(
  '/edit-pet',
  [
    body('imageUrl').isURL(),
    // body('imageFile'),
    body('name').notEmpty().isString().isLength({ min: 3 }).trim(),
    body('breed').notEmpty().withMessage('Please enter the breed of your dog'),
    body('age').notEmpty().withMessage('Please enter the age of your dog'),
    body('gender').notEmpty().withMessage('Please enter the gender of your dog'),
    body('size').notEmpty().withMessage('Please enter the size of your dog'),
    body('description').notEmpty().isLength({ min: 5, max: 400 }).trim().withMessage('Please enter a description'),
    body('specialNeeds'),
  ],
  isUser,
  adminController.postEditPet
);

router.post('/delete-pet', isUser, adminController.postDeletePet);

module.exports = router;