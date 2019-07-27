const express = require("express");
const cr = express.Router();

const firebase = require('../authConnection').firebase;
const db = require('../connection').db;
function getSurveyList(id){
    return db.collection('Customers').doc(id).get();

 }
async function getSurveys(id,status, callback){

    let openSurveys = [];
    let closeSurveys = [];
    let draftSurveys = [];
    let snapshot = await getSurveyList(id);
    //console.log(snapshot.data().surveylist);
    //console.log((snapshot.data().surveylist).includes('K0MLUyw4nTMYMyVhrruy'));
    
    let survyesIds = snapshot.data().surveylist;
    let surveySnapshot=await db.collection('Survey').get();
        surveySnapshot.forEach(survey =>{
            let doc = survey.data();
            doc.id = survey.id;
            console.log(survey.id)
            if(survyesIds.includes(survey.id) && doc.status == 'draft') { draftSurveys.push(doc); console.log("draft") }
            else if(survyesIds.includes(survey.id) && doc.status == 'open') {openSurveys.push(doc); console.log("open")}
            else if(survyesIds.includes(survey.id) && doc.status == 'close') {closeSurveys.push(doc);console.log("close")}
            else console.log(survey.id,"does not match");
           // console.log(survey.id);

        });
    // console.log(draftSurveys);
    // console.log(openSurveys);
    // console.log(closeSurveys);
    
    if(status =='draft'){
        //let surveys = {"survey":draftSurveys};
        //console.log();
       
        
        //console.log("soreted",draftSurveys[0].lastEdited.toDate());
      if(draftSurveys.length){
        draftSurveys.sort((a,b) =>{
            console.log( a.lastEdited._seconds, b.lastEdited._seconds);
            return  b.lastEdited._seconds - a.lastEdited._seconds;  
          })
          for (var i = 0; i < draftSurveys.length; i++){
            draftSurveys[i].lastEdited = (draftSurveys[i].lastEdited.toDate());
    }
        callback(0,{"survey":draftSurveys, "found":1})
         }     
      else {
        callback(1, {"survey":null, "found":0});
        //reject("draft surveys not found");  
      } 
    } 
    else if(status =='open'){
        //let surveys = {"survey":openSurveys};
       
            
        if(openSurveys.length){
            openSurveys.sort((a,b) =>{
                //   console.log( a.closeTime._seconds, b.closeTime._seconds);
                   return a.closeTime._seconds - b.closeTime._seconds; 
                    
                 })
            for (var i = 0; i < openSurveys.length; i++){
                    openSurveys[i].closeTime = (openSurveys[i].closeTime.toDate());
            }
            console.log("open survey",openSurveys);
            callback(0,{"survey":openSurveys, "found":1})
             }     
          else {
            callback(1, {"survey":null, "found":0});
            //reject("draft surveys not found");  
          } 
      } 
      else if(status =='close'){

        if(closeSurveys.length){
            closeSurveys.sort((a,b) =>{
                //   console.log( a.closeTime._seconds, b.closeTime._seconds);
                   return  b.closeTime._seconds -a.closeTime._seconds; 
                    
                 })
                 for (var i = 0; i < closeSurveys.length; i++){
                   closeSurveys[i].closeTime = (closeSurveys[i].closeTime.toDate());
               }
             

            callback(0,{"survey":closeSurveys, "found":1})
             }     
          else {
            callback(1, {"survey":null, "found":0});
            //reject("draft surveys not found");  
          } 
      } 
      else callback(0 ,{"found":0})

     

}
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
    
})

cr.get('/', (req,res) =>{

    if(req.session.email){
        //dataset = {email: req.session.email, uid: req.session.uid};
        //console.log(req.session.email);
        //console.log("welcome customer sceen")
        res.render('./customerViews/dashboard');    
    }
    else res.redirect('/customer/login');
    
})
cr.get('/draftSurvey', (req,res) =>{

    if(req.session.email){
        //dataset = {email: req.session.email, uid: req.session.uid};
        //console.log(req.session.email);
        //console.log("welcome customer sceen")
        getSurveys('470bnBREgYBB2QupJrmR','draft', (err,surveys) =>{
            if(!err){
                 console.log("survey",surveys);
                 res.render('./customerViews/draftSurvey',surveys);
            }
            else{
                console.log("survey",surveys);
                console.log("surveys not found");
                res.render('./customerViews/draftSurvey',surveys);
            } 
               
        })   
         
    }
    else res.redirect('/customer/login');
    
})
cr.get('/openSurvey', (req,res) =>{

    if(req.session.email){
        //dataset = {email: req.session.email, uid: req.session.uid};
        //console.log(req.session.email);
        //console.log("welcome customer sceen")
        getSurveys('470bnBREgYBB2QupJrmR','open', (err,surveys) =>{

            if(!err){
                console.log("survey",surveys);
                res.render('./customerViews/openSurvey',surveys);
           }
           else{
               console.log("survey",surveys);
               console.log("surveys not found");
               res.render('./customerViews/openSurvey',surveys);
           }    
        })    
       
    }
    else res.redirect('/customer/login');
    
})

cr.get('/closedSurvey', (req,res) =>{

    if(req.session.email){
        //dataset = {email: req.session.email, uid: req.session.uid};
        //console.log(req.session.email);
        //console.log("welcome customer sceen")
        getSurveys('470bnBREgYBB2QupJrmR','close', (err,surveys) =>{
        if(!err){
                 //console.log("survey",surveys);
                 res.render('./customerViews/closedSurvey',surveys);
            }
            else{
               // console.log("survey",surveys);
                console.log("surveys not found");
                res.render('./customerViews/closedSurvey',surveys);
            }   
        })    
         
    }
    else res.redirect('/customer/login');
    
})

module.exports = cr;