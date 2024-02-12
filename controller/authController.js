const ejs = require('ejs');
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const path = require('path')

const login = (req,res) => {
    if(res.locals.users){
        return res.redirect('/');
    }
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    return res.render('login')
}

const loginUser = (req, res, next) => {
    return res.redirect('/')
};


const register = (req,res) => {
    return res.render('register')
}

const addUser = async (req,res) => {
    const {name,email,password} = req.body
    try{
        let userCreate = await userModel.create({
            name,
            email,
            password : await bcrypt.hash(password,10)
        })
        return res.redirect('/login');
    }catch(err){
        console.log(err);
        return false
    }
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect("/");
    });
};

const forgotpasswordPage = (req,res) =>{
    return res.render('forgotpassword')
} 

const forgotPassword = async(req,res) => {
    try{
        let email = req.body.email
        let checkEmail = await userModel.findOne({email : email});
        let templatePath = path.join(__dirname, '../views/admin/mail.ejs');
        if(checkEmail){
            let otp = Math.floor(Math.random() * 1000000);
            let template = await ejs.renderFile(templatePath, { checkEmail, otp });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'idkworld0078@gmail.com',
              pass: 'vgnn vxqq yzfa sqhy'
            }
          });
          var mailOptions = {
            from: 'idkworld0078@gmail.com',
            to: email,
            subject: `Otp`,
            html: template,
            // attachments : [
            //     {
            //     filename: 'logo.png',
            //         path: 'public/img/logo.png',
            //         cid: 'logo'
            //     },
            // ]

          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.cookie('otp',{
                otp : otp,
                email : email
              });
              req.flash('success', `A code has been sent to ${email}`)
              return res.redirect('/otp');
            }
          });
       }else{
            req.flash('error',"User not found");
            return res.redirect('/');
       }
        
    }catch(err){
        console.log(err);
        return false;
    }
}

const otpPage = async(req,res) => {
    try{
        // if(!req.cookies.otp){
        //     return res.redirect('/');
        // }
        return res.render('otp', { messages: req.flash('success', 'error') });
    }catch(err){
        console.log(err);
        return false;
    }
}

const postOtp = async (req, res) => {
    try {
        let userOtp = req.body.otp;
        let otpCookie = req.cookies.otp;

        console.log('otpCookie:', otpCookie);

        if (!otpCookie || otpCookie.otp !== userOtp) {
            console.log("Otp is wrong or not provided");
            return res.redirect('back');
        }
        if(userOtp == otpCookie){
            console.log(`OTP Match`);
            res.clearCookie('otp');
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};


const resetPassword = (req,res) => {
    return res.render('reset-password')
}



module.exports = {
    login,
    register,
    addUser,
    loginUser,
    logout,
    forgotpasswordPage,
    forgotPassword,
    otpPage,
    resetPassword,
    postOtp
}