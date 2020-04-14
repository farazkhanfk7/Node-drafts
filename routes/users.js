const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// init model
const User = require('../models/User');

//login
router.get('/login',(req,res)=>{
    res.render('login');
});

//log error
router.get('/loggin',(req,res)=>{
    let logflash = [{msg:'Wrong email or password. Please try again'}]
    res.render('login',{logflash})
});

//register
router.get('/register',(req,res)=>res.render('register'));

// post requests for login and register
router.post('/register',(req,res)=>{
    const { name,email,password, password2 } = req.body;
    let errors = [];
    //check required fields
    if(!name || !email || !password || !password2 ){
        errors.push({ msg: 'Please fill in all fields'});
    }

    // check if password match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    // check password length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    console.log(errors);

    if(errors.length > 0){
        res.render('register',{errors,name,email,password,password2});
    }else{
        //validate
        User.findOne({email : email}).then(user =>{
            if(user){
                //user exist warning
                errors.push({msg:'Email already taken'})
                res.render('register',{errors,name,email,password,password2});
            } else{
                const newUser = new User({name,email,password})
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser.save().then(user => {
                          let flashes = [];
                          flashes.push({msg:'You are registered. Please login'})
                          res.render('login',{flashes});
                        }).catch(err => console.log(err));
                    });
                  });
            }
        })
    }
});



//login post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{ successRedirect: '/dashboard',failureRedirect: '/users/loggin'})(req,res,next);
})


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
  });
module.exports = router;