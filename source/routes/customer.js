const express = require("express");
const cr = express.Router();

const firebase = require('./authConnection').firebase;

cr.get('/signin', (req,res) =>{

    res.render('./customerViews/signin');
})

cr.post('/handleSignin', (req,res) =>{

   // email = req.body.email;
   //pass =req.body.pass;
   email = 'mirza.bilal.ahmad@gmail.com';
   password = 'mirza';
   firebase.auth().createUserWithEmailAndPassword(email, pass).catch((error) => {
        console.log(error.message);
        res.send('false');
      });
    res.send('true');
    //res.redirect('/paypersurvey-67687/us-central1/app/customer/');
})

cr.get('/logout', (req,res) =>{
    res.render('index');
})

cr.get('signup', (req,res) =>{
    res.render('./customerViews/signup');
})

cr.get('/handleSignup', (req,res) =>{
    res.render('./customerViews/signup');
})

cr.get('/', (req,res) =>{
    console.log("welcome customer sceen")
    res.render('./customerViews/dashboard');
})


module.exports = cr;