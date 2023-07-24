const express = require('express');
const router = express.Router({ mergeParams: true }); 

const {reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const Coolplace = require('../models/coolplace');

const reviews = require('../controllers/reviews')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;