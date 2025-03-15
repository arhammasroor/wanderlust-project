const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../schema.js");
const reviewSchema = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=>
            el.message
        ).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }

}
// reviews
router.post("/",isLoggedIn,validateReview,wrapasync(reviewcontroller.createreview)
);

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewcontroller.deletereview))

module.exports = router;