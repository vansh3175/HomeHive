const User = require('../models/user');

module.exports.signupForm = (req,res)=>{
    res.render('user/signup.ejs');
}

module.exports.signup = async (req,res)=>{
    let {username,password,email}=req.body;
    let newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to HomeHive");
        res.redirect('/listings');
    })
    
    
}
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back! We missed you..");
    res.redirect('/listings');
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","logged out successfully");
        res.redirect("/listings");
    })
};