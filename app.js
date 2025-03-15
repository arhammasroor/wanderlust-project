if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;

const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24* 3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,// 7 days 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();

})

// app.get("/register",(req,res)=>{
//     let {name="anonymous"}=req.query;
//     req.session.name=name;
//     if(name == "anonymous"){
//         req.flash("error","user fails to register");
//     }
//     else{
//         req.flash("success","user registered successfully");
//     }
    

//     res.redirect("/hello");
// })
// app.get("/hello",(req,res)=>{
//   res.render("listings/demo.ejs",{name: req.session.name});
// })

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you send a request ${req.session.count} times`);
// })

app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
main().then(()=>{
    console.log("connection success");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);//'mongodb://127.0.0.1:27017/wanderlust'
}

// app.get("/",(req,res)=>{
//     // res.cookie("name","arham");
//     res.send("working");
// });
//delete it after cookie check
// app.get("/cookie",(req,res)=>{
//     console.log(req.cookies);
//     res.send("hi i am a cokkie");
// })

// app.get("/greet",(req,res)=>{
//     let {name=":)"}=req.cookies;
//     res.send(`hi,${name}`);
// })
// app.get("/signedcookie",(req,res)=>{
//     res.cookie("country","India",{signed: true});
//     res.send("signed cokkie");
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser= await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let { statuscode=500, message= "something went wrong"} = err;
    res.render("listings/error.ejs",{message});
    
})

app.listen(8080,()=>{
    console.log("server is listening");
})































//update route
// app.put("listings/:id", async(req,res)=>{
//     // let { id } =  req.params;
//     // console.log(...req.body.listing);
//     // await Listing.findByIdAndUpdate(id,{...req.body.listing});//...deconstruct
//     // res.redirect("/listings");
//     res.send("working");
// })




// app.get("/testlisting",async(req,res)=>{
//     let samplelisting = new Listing({
//         title: " My new villa",
//         description: "by the beach",
//         price: 5000,
//         location: "calangute, goa",
//         country: "india",
//     })

//     await samplelisting.save();
//     res.send("successfull");

// })