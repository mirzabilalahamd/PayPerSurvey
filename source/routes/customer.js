const express = require("express");
const cr = express.Router();

const firebase = require('../authConnection').firebase;
const db = require('../connection').db;

cr.get('/login', (req,res) =>{

    res.render('./customerViews/login');
})

cr.post('/handlelogin', async (req,res) =>{

    var email = req.body.email;
    var password = req.body.password;
    sess = req.session;

    await firebase.auth().signInWithEmailAndPassword(email, password)
    .then( (user) =>{
         console.log("signin",user.user.uid);
         sess.uid = user.user.uid;
        })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          console.log('Wrong password.');
        } else {
            console.log(errorMessage);
        }
        console.log(error);

        res.send(false);
      });
    sess.email = email; 
    res.send(true);
    //res.redirect('/paypersurvey-67687/us-central1/app/customer/');
})

cr.get('/logout', (req,res) =>{
    req.session.destroy( (error) =>{
        if(error) console.log(error);
        else res.redirect('/');
    })
    
})

cr.get('/register', (req,res) =>{
    res.render('./customerViews/register');
})

cr.post('/handleRegisteration', async (req,res) =>{
    
    name = req.body.name;
    email = req.body.email;
    password =req.body.password;
    conf_password = req.body.conf_password;
    
    console.log(name,email, password, conf_password);
    
    await firebase.auth().createUserWithEmailAndPassword(email,password).catch( (error) =>{
        console.log("signup err", error.message);
        res.send(false);

    })
    var customer = db.collection('Customers');
    await customer.add({
        name: name,
        email: email,
        password: password,
        balance: 0,
        surveylist: []
    })
    .then( (ref) =>{
        console.log("document added" + ref.id);
        res.send(true);
    });
    

    //res.send('sucessfully registered');
    // res.render('./customerViews/signup');
})

cr.get('/', (req,res) =>{

    if(req.session.email){
        dataset = {email: req.session.email, uid: req.session.uid};
        //console.log(req.session.email);
        //console.log("welcome customer sceen")
        res.render('./customerViews/dashboard',dataset);    
    }
    else res.redirect('/customer/login');
    
})


module.exports = cr;