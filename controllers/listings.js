const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allisting = await Listing.find({});
    res.render("listings/index",{ allisting });
    };
module.exports.newform =  (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showlistings =  async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};
module.exports.createnewlisting =  async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,//return only one co-ordinate out of many
      })
        .send()
        
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry =  response.body.features[0].geometry;

    await newlisting.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
};
module.exports.editform =  async(req,res)=>{
    let { id} = req.params;
    const listing = await Listing.findById(id);
    let originalimage = listing.image.url;
    originalimage=originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalimage});
};
module.exports.editlisting =  async(req,res)=>{
    let { id } =  req.params;
    // console.log(...req.body.listing);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","updated successfully");//...deconstruct
    res.redirect(`/listings/${id}`);
};
module.exports.deletelisting =  async(req,res)=>{
    let { id } =  req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    res.redirect("/listings");

};