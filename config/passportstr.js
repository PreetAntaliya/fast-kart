const passport= require('passport')
const passportLocal = require('passport-local').Strategy
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')

passport.use(new passportLocal({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        let user = await userModel.findOne({ email: email });
        
        if (!user) {
            console.log(`User not found`);
            return done(null, false);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            console.log(`Incorrect Password`);
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(null, false);
    }
}));

passport.serializeUser((user,done) => {
    return done(null,user.id);
})

passport.deserializeUser(async(id,done) => {
    try{
        const user = await userModel.findById(id)
        return done(null,user)
    } catch(err) {
        console.log(err);
        return done(null,false)
    }
})

passport.checkUser = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login'); 
}

passport.setUser = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.users = req.user 
    }
    return next();
}

module.exports=passport;