const express = require('express')
const homeController = require('../controller/homeController')
const authController = require('../controller/authController')
const passport = require('passport')
const multer = require('multer')
const routes = express.Router()

routes.get('/', homeController.home)
routes.get('', homeController.home)


module.exports = routes