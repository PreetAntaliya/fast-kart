const express = require('express')
const homeController = require('../controller/homeController')
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
    successRedirect: '/',
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

routes.get('/', passport.checkUser, homeController.home)

routes.get('/product', passport.checkUser, homeController.product)
routes.get('/add-product', passport.checkUser, homeController.addProduct)

routes.get('/category', passport.checkUser, homeController.category)
routes.get('/add-category', passport.checkUser, homeController.addCategory)
routes.post('/addCategory', passport.checkUser, homeController.categoryCreate)
routes.get('/deleteCategory', passport.checkUser, homeController.deleteCategory)
routes.get('/categoryActive',passport.checkUser,homeController.categoryActive);
routes.get('/categoryDective',passport.checkUser,homeController.categoryDective);

routes.get('/subcategory', passport.checkUser, homeController.subcategory)
routes.get('/add-subcategory', passport.checkUser, homeController.addsubcategory)
routes.post('/addSubategory', passport.checkUser, homeController.subcategoryCreate)
routes.get('/deleteSubcategory', passport.checkUser, homeController.deleteSubcategory)

module.exports = routes