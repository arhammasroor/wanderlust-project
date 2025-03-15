const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const listingSchema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isOwner} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage });


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>
            el.message
        ).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}
router.route("/")
.get(wrapasync(listingcontroller.index)) //index route
.post(isLoggedIn,upload.single("listing[image]"), wrapasync(listingcontroller.createnewlisting));// create route

router.get("/filter",async(req,res)=>{
    const searchTerm = req.query.q;
    let filterlisting = await Listing.find({country:`${searchTerm}`});
    console.log(filterlisting);    
    res.render("listings/filter.ejs",{filterlisting});
    
})

//new route
router.get("/new", isLoggedIn ,listingcontroller.newform)

router.route("/:id")
.get(wrapasync(listingcontroller.showlistings))   //show route
.put( isLoggedIn,isOwner,upload.single("listing[image]"),wrapasync(listingcontroller.editlisting))
.delete( isLoggedIn,isOwner,wrapasync(listingcontroller.deletelisting));//delete route
//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapasync(listingcontroller.editform));


module.exports= router;


