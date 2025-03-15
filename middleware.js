const Listing = require("./models/listing");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path,"..",req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create.");
        return res.redirect("/login");
    }
    next(); 
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } =  req.params;
    // console.log(...req.body.listing);
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not authorised to it sorry ):");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    let { reviewId,id } =  req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not authorised to it sorry ):");
        return res.redirect(`/listings/${id}`);
    }
    next();
}