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
    const {name,email,password,cpassword} = req.body
    try{
        if(password==cpassword){
            let userCreate = await userModel.create({
                name,
                email,
                profile_pic: req.file.path,
                password : await bcrypt.hash(password,10)
            })
            return res.redirect('/login');
        }
        return res.send(`enter both password same`)
    }catch(err){
        console.log(err);
        return false
    }
}

const updateUser = async (req,res) => {
    try{
        const {name,email} = req.body
        const update = await userModel.findByIdAndUpdate(req.body.id,{
            name,
            email
        })
        return res.redirect('back')
    }catch(err){
        console.log(err);
        return false
    }
}

const deleteAccount = async (req,res) => {
    try{
        let id = req.query.id
        let deleteUser = await userModel.findByIdAndDelete(id)
        req.logout()
        return res.redirect('/')
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
            let otpPlus = await bcrypt.hash(otp.toString(), 10);
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
                otp : otpPlus,
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
        let cookieOtp = req.cookies.otp;

        console.log(`user otp is ${userOtp}`);
        console.log('cookieOtp:', cookieOtp);

        if (cookieOtp && await bcrypt.compare(userOtp, cookieOtp.otp)) {
            // Correct OTP
            return res.redirect('/reset-password');
        } else {
            console.log("Otp is wrong");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};



const resetPassword = (req,res) => {
    return res.render('reset-password')
}

const newPassword = async (req,res) => {
    try{    
        let password = req.body.password
        let cpassword = req.body.cpassword
        if(password == cpassword){
            const pass = await userModel.findOneAndUpdate({email : req.cookies.otp.email}, {
                password : await bcrypt.hash(password, 10)
            })
            res.clearCookie('otp')
            return res.redirect('/login')
        }
        console.log(`err..........!`);
        return false
    }catch(err) {
        console.log(err);
        return false
    }
}

const changePasswordPage = (req,res) => {
    let user = req.user
    return res.render('change-password',{user})
}

const changePassword = async (req,res) => {
    try{
        const {currentPassword,newPassword,cpassword,email} = req.body
        let compare = await bcrypt.compare(currentPassword,req.user.password)
        if(compare){
            if(newPassword == cpassword){
                let change = await userModel.findOneAndUpdate({email: email}, {
                    password : await bcrypt.hash(newPassword, 10)
                })
                if (changeSuccessful) {
                    req.logout((err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Error logging out");
                        }
                        res.redirect('/login'); // Redirect only if logout was successful
                    });
                } else {
                    return res.status(400).send("Failed to change password");
                }
            }
            return false
        }
        return false
    }catch(err) {
        console.log(err);
        return false
    }
}



module.exports = {
    login,
    register,
    addUser,
    loginUser,
    logout,

    updateUser,
    deleteAccount,

    forgotpasswordPage,
    forgotPassword,
    otpPage,
    resetPassword,
    postOtp,
    newPassword,
    changePasswordPage,
    changePassword
}