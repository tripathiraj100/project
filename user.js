const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../util/warpAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res) =>{
    res.render("users/signup.ejs");
});
router.post("/signup", warpAsync(async(req,res,next) =>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            res.redirect("/listings");
        });
    } catch(e) {
        console.log(e.message);
        res.redirect("/signup");

    }
}));
router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
    // res.redirect("/listings");
});
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{ 
        failureRedirect: '/login', 
        failureFlash : true 
    }),
    async(req,res) =>{
        // res.send("Welcome to wanderdev! you are logged in!");
        res.redirect(res.locals.redirectUrl);

});
router.get("/logout",(req,res,next) =>{
    req.logout((err) =>{
        if(err) {
           return next(err);
        }
        res.redirect("/listings");
        
    });
});
    

module.exports = router;