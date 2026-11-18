const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/warpAsync.js");
const ExpressError = require ("../util/ExpressError.js");
const {listingSchema} = require("../views/schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,result.errMsg);
    }else{
        next();
    }
};

//Index route
router.get("/",  wrapAsync(async (req,res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
}));
//new route
router.get("/new", isLoggedIn,(req,res) => {
    res.render("listings/new.ejs");

});
// show route
router.get("/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));
// Create Route (POST /listings)
router.post("/", isLoggedIn,validateListing, wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    res.redirect("/listings");
    })
);
//edit route
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",validateListing,wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));
module.exports = router;