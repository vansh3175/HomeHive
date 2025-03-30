const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');
const passport = require('passport');
const {authenticate, isOwner} = require('../middlewares/authenticate.js');
const listingController = require('../controllers/listingsController.js');
const multer  = require('multer');
const {storage} = require('../cloudSetup.js');
const upload = multer({storage});

//middleware function for checking validation of data
const listingValidation = (req,res,next)=>{
    console.log(req.body);
    const {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    else next();
}


//home route and post
router.route('/')
.get(wrapAsync(listingController.index))
.post(authenticate,upload.any('listing-image'),listingValidation,wrapAsync(listingController.createListing));

//route for rendering new form
router.get("/new",authenticate,(req,res)=>{
    res.render("listings/new.ejs");
})
router.get("/search/:q",wrapAsync(listingController.search));
//route for rendering complete details of a listing and edit and delete
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(authenticate,isOwner,upload.any('listing-image'),listingValidation,wrapAsync(listingController.edit))
.delete(authenticate,isOwner,wrapAsync(listingController.destroy))

//edit form route
router.get("/:id/edit",authenticate,isOwner,wrapAsync(listingController.editForm));

module.exports = router;