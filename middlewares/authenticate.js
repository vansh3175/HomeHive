const Listing = require('../models/listing');
const Review = require('../models/review');


module.exports.authenticate = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must logged in");
        return res.redirect('/user/login');
    }
    next();
}
module.exports.isOwner =async (req,res,next)=>{
    console.log(req.params.id);
    const lis = await Listing.findById(req.params.id).populate('owner');
    if (!lis) {
        return next(new Error("Listing not found!"));
    }
    
    const owner = lis.owner;
    if(!req.user || !req.user._id.equals(owner._id)){
        req.flash("error","You are not the owner!");
        return res.redirect('/listings');
    }
    next();
}

module.exports.isReviewOwner = async (req,res,next)=>{
    
    const Rev = await Review.findById(req.params.reviewId);
    if (!Rev) {
        return next(new Error("Review not found!"));
    }
    
    if(!req.user || !req.user._id.equals(Rev.author)){
        req.flash("error","You are not the owner!");
        return res.redirect('/listings');
    }
    next();
}