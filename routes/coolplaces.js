const express = require('express');
const router = express.Router(); 
const Coolplace = require('../models/coolplace');
const coolplaces = require('../controllers/coolplaces');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const {isLoggedIn, validateCoolplace, isAuthor} = require('../middleware')

router.route('/')
    .get(catchAsync(coolplaces.index))
    .post(isLoggedIn, upload.array('image'), validateCoolplace, catchAsync(coolplaces.createCoolplace))


router.get('/new', isLoggedIn, coolplaces.renderNewForm)

router.route('/:id')
    .get(catchAsync(coolplaces.showCoolplace))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCoolplace, catchAsync(coolplaces.updateCoolplace))
    .delete(isLoggedIn, isAuthor, catchAsync(coolplaces.deleteCoolplace))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(coolplaces.renderEditForm))

module.exports = router;