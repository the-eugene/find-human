const router = require('express').Router();
const {
  body
} = require('express-validator');

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
    body('imageUrl').isURL(),
    body('name').isString().isLength({ min: 3 }).trim(),
    body('species'),
    body('breed'),
    body('age'),
    body('gender'),
    body('activityLevel'),
    body('size'),
    body('description').isLength({ min: 5, max: 400 }).trim(),
    body('specialNeeds'),
    body('adoptionFee').isFloat(),      
  ],
  isUser,
  adminController.postAddPet
);

router.get('/edit-pet/:petId', isUser, adminController.getEditPet);

router.post(
  '/edit-pet',
  [
    body('imageUrl').isURL(),
    body('name').isString().isLength({ min: 3 }).trim(),
    body('species'),
    body('breed'),
    body('age'),
    body('gender'),
    body('activityLevel'),
    body('size'),
    body('description').isLength({ min: 5, max: 400 }).trim(),
    body('specialNeeds'),
    body('adoptionFee').isFloat(),   
  ],
  isUser,
  adminController.postEditPet
);

router.post('/delete-pet', isUser, adminController.postDeletePet);

module.exports = router;