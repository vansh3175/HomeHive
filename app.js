require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js')
const MONGO_URL=process.env.MONGO_URL;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js')
const Review = require('./models/review.js')
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const { storage } = require('./cloudSetup.js');


const store = MongoStore.create({
    mongoUrl:MONGO_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
      }
  })

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpsOnly : true,
        expires : Date.now() + 1000*24*60*60*7,    //in milliseconds
        maxAge : 1000*24*60*60*7 

    }
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());


main()
.then((result)=>{
    console.log("connected to databases successfully");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.listen(8080,()=>{
    console.log("Ther server has been started");
})

//root route
app.get('/',(req,res)=>{
    res.send("hi there");
})

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); // intialize
app.use(passport.session());  // passport will use session
passport.use(new LocalStrategy(User.authenticate()));  //passport will use local strategy

passport.serializeUser(User.serializeUser());  // storing user in session
passport.deserializeUser(User.deserializeUser());  // removing user from the session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use('/listings',listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/user', userRouter);


app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
//Error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"}=err;
    if(status==404){
        res.status(404).render("errors/pageNotFound.ejs");
    }
    
    else{
        res.status(status).render('errors/basicError.ejs',{message});
    }
    
})

