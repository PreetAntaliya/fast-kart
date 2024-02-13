const express = require('express')
const adminController = require('../controller/adminController')
const authController = require('../controller/authController')
const passport = require('passport')
const multer = require('multer')
const routes = express.Router()

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb)=> {
        let img = Date.now() + "-" + file.originalname;
        cb(null, img);
    }
})

const upload  = multer({storage}).single('')


routes.get('/login', authController.login)
routes.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));
routes.get('/logout', authController.logout)
routes.get('/forgotpassword', authController.forgotpasswordPage)
routes.post('/forgot-password', authController.forgotPassword);
routes.get('/register', authController.register)
routes.post('/addUser', authController.addUser)
routes.get('/otp', authController.otpPage)
routes.get('/reset-password', authController.resetPassword)
routes.post('/postOtp', authController.postOtp)

routes.get('/dashboard', passport.checkUser, adminController.dashboard)

routes.get('/product', passport.checkUser, adminController.product)
routes.get('/add-product', passport.checkUser, adminController.addProduct)

routes.get('/category', passport.checkUser, adminController.category)
routes.get('/add-category', passport.checkUser, adminController.addCategory)
routes.post('/addCategory', passport.checkUser, adminController.categoryCreate)
routes.get('/deleteCategory', passport.checkUser, adminController.deleteCategory)
routes.get('/categoryActive',passport.checkUser,adminController.categoryActive);
routes.get('/categoryDective',passport.checkUser,adminController.categoryDective);

routes.get('/subcategory', passport.checkUser,adminController.subcategory)
routes.get('/add-subcategory',passport.checkUser, adminController.addsubcategory)
routes.post('/addSubategory',passport.checkUser, adminController.subcategoryCreate)
routes.get('/deleteSubcategory',passport.checkUser, adminController.deleteSubcategory)
routes.get('/editSubcategory',passport.checkUser, adminController.editSubcategoryPage)
routes.post('/updateSubategory',passport.checkUser, adminController.updateSubategory)

module.exports = routes