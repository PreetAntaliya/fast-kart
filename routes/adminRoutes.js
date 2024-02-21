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

const upload  = multer({storage})

routes.get('/login', authController.login)
routes.post('/loginUser', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));
routes.get('/logout', authController.logout)
routes.get('/forgotpassword', authController.forgotpasswordPage)
routes.post('/forgot-password', authController.forgotPassword);
routes.get('/register', authController.register)
routes.post('/addUser',upload.single('profile_pic'), authController.addUser)
routes.get('/otp', authController.otpPage)
routes.get('/reset-password', authController.resetPassword)
routes.post('/postOtp', authController.postOtp)
routes.post('/newPassword', authController.newPassword)

routes.get('/dashboard', passport.checkUser, adminController.dashboard)

routes.get('/product', passport.checkUser, adminController.product)
routes.get('/add-product', passport.checkUser, adminController.addProduct)
routes.post('/createProduct', passport.checkUser,upload.array('productImg',5), adminController.createProduct)
routes.get('/categoryFilterProduct', passport.checkUser, adminController.categoryFilterProduct)

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
routes.get('/categoryFilter', passport.checkUser, adminController.categoryFilter)

routes.get('/exsubcategory' , passport.checkUser, adminController.exsubcategory)
routes.get('/add-exsubcategory' , passport.checkUser, adminController.addexsubcategory)
routes.post('/addExSubategory' , passport.checkUser, adminController.exsubcategoryCreate)
routes.get('/deleteExcategory' , passport.checkUser, adminController.deleteexSubcategory)
routes.get('/editExcategory' , passport.checkUser, adminController.editexSubcategoryPage)
routes.post('/updateExSubategory' , passport.checkUser, adminController.updateexSubategory)

routes.get('/profile', passport.checkUser, adminController.profile)
routes.get('/deleteAccount', passport.checkUser, authController.deleteAccount)
routes.post('/updateProfile', passport.checkUser, authController.updateUser)

// routes.post('/profileDeta',  adminController.profile)

module.exports = routes