const { validationResult } = require('express-validator/check');

const pet = require('../models/pet');

exports.getAddpet = (req, res, next) => {
  res.render('admin/edit-pet', {
    pageTitle: 'Add pet',
    path: '/admin/add-pet',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddpet = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-pet', {
      pageTitle: 'Add pet',
      path: '/admin/add-pet',
      editing: false,
      hasError: true,
      pet: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const pet = new pet({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  pet
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created pet');
      res.redirect('/admin/pets');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
};

exports.getEditpet = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.petId;
  pet.findById(prodId)
    .then(pet => {
      if (!pet) {
        return res.redirect('/');
      }
      res.render('admin/edit-pet', {
        pageTitle: 'Edit pet',
        path: '/admin/edit-pet',
        editing: editMode,
        pet: pet,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditpet = (req, res, next) => {
  const prodId = req.body.petId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-pet', {
      pageTitle: 'Edit pet',
      path: '/admin/edit-pet',
      editing: true,
      hasError: true,
      pet: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  pet.findById(prodId)
    .then(pet => {
      if (pet.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      pet.title = updatedTitle;
      pet.price = updatedPrice;
      pet.description = updatedDesc;
      pet.imageUrl = updatedImageUrl;
      return pet.save().then(result => {
        console.log('UPDATED pet!');
        res.redirect('/admin/pets');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getpets = (req, res, next) => {
  pet.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(pets => {
      console.log(pets);
      res.render('admin/pets', {
        prods: pets,
        pageTitle: 'Admin pets',
        path: '/admin/pets'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeletepet = (req, res, next) => {
  const prodId = req.body.petId;
  pet.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED pet');
      res.redirect('/admin/pets');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};