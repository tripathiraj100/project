const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require ("./util/ExpressError.js");
const session = require("express-session");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_DB = "mongodb://127.0.0.1:27017/wanderdev";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) =>{ 
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_DB);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true, // Capital 'U'
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/",(req,res) => {
    res.send("Hi i am root");
});

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async(req,res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// });
app.use((req,res,next) => {
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter); 
app.use("/", userRouter);

app.use((req,res,next) => {
    next(new ExpressError(404,"Page not found! "));
});
app.use((err,req,res,next)=> {
    let {statusCode = 500,message = "Something went wrong! "} = err;
    res.status(statusCode).render("error.ejs",{err,message});
    // res.send("something went wrong");
    // res.render("error.ejs",{err});
});

app.listen(5050 , () =>{
    console.log("server is listening to the port 5050");
}); 