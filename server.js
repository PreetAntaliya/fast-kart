const express = require('express')
const path = require('path');
const port= 8000
const app =express()
const flash = require('connect-flash');
const db = require('./config/db')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('./config/passportstr')
const session = require('express-session');
app.use(cookieParser())

app.use(session({
    name : 'idk',
    secret : 'idk#0078',
    saveUninitialized  :true,
    resave : true,
    cookie : {maxAge : 1000 * 60 * 60 * 24}
}))

app.use(flash());

app.use('/public',express.static(path.join(__dirname,'public')))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.set('view engine','ejs')
app.use(express.urlencoded())
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser) 


app.use('/',require('./routes/index'))
app.use('/',require('./routes/adminRoutes'))
app.use('/api',require('./routes/api'))


app.listen(port,(err) => {
    if(err){
        console.log(err);
    }
    console.log(`server was running...`);
})