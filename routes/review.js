const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js')
const {reviewSchema} = require('../schema.js')
const Listing = require('../models/listing.js')
const passport = require('passport');
const {authenticate ,isReviewOwner} = require('../middlewares/authenticate.js');
const reviewController = require('../controllers/reviewController.js');

const reviewValidation = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    else next();
}

//add review
router.post('/',authenticate,reviewValidation,wrapAsync(reviewController.createReview));
//delete review
router.delete('/:reviewId',authenticate,isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports = router;