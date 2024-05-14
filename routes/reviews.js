const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const Story = require('../models/story');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const ExpressError = require('../Utilities/ExpressError');
const catchAsync = require('../Utilities/catchAsync');

router.post('/', validateReview, isLoggedIn, catchAsync (reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview))

module.exports = router;