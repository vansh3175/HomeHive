const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js')
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const User = require('../models/user.js');
const passport = require('passport');
const userController = require('../controllers/userController.js');

router.route('/signup')
.get(userController.signupForm)
.post(wrapAsync(userController.signup))

router.route('/login')
.get((req,res)=>{
    res.render('user/login.ejs');
})
.post( passport.authenticate("local", { 
    failureRedirect: '/user/login', 
    failureFlash: true 
}), userController.login);

router.get('/logout',userController.logout)


module.exports = router;