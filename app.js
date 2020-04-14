const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const app = express();

// require our passport config file
require('./config/passport')(passport);

// connect db
const db = require('./config/keys').MongoURI;
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('MongoDB Connected..')).catch(err => console.log(err));

// body parser
app.use(express.urlencoded({ extended : false}));

//passport init
app.use(passport.initialize())
app.use(passport.session())

// session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//flash
// app.use(flash());
// app.use((req,res,next)=>{
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
// })


//ejs
app.use(expresslayouts);
app.set('view engine','ejs');

// routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on ${PORT}`));