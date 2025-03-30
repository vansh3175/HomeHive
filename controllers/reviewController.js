const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async (req,res)=>{
    console.log(req.params.id);
    let listingMain = await Listing.findById(req.params.id);
    let reviewMain = new Review({...req.body.review});
    reviewMain.author = req.user;

    listingMain.reviews.push(reviewMain);

    await reviewMain.save();
    await listingMain.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${req.params.id}`);
    
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}