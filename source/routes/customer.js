const express = require("express");
const cr = express.Router();

const firebase = require('../authConnection').firebase;
const db = require('../connection').db;
let FieldValue = require('firebase-admin').firestore.FieldValue;
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
           // console.log(survey.id)
            if(survyesIds.includes(survey.id) && doc.status == 'draft') { draftSurveys.push(doc);  }
            else if(survyesIds.includes(survey.id) && doc.status == 'open') {openSurveys.push(doc); }
            else if(survyesIds.includes(survey.id) && doc.status == 'close') {closeSurveys.push(doc);}
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
            //console.log( a.lastEdited._seconds, b.lastEdited._seconds);
            return new Date(b.lastEdited) - new Date(a.lastEdited);
          })
    //       for (var i = 0; i < openSurveys.length; i++){
    //         draftSurveys[i].lastEdited = (draftSurveys[i].lastEdited.toDate());
    // }

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
                 //  return a.closeTime._seconds - b.closeTime._seconds;
                    return new Date(b.closeTime) - new Date(a.closeTime)
                 })
            // for (var i = 0; i < openSurveys.length; i++){
            //         openSurveys[i].closeTime = (openSurveys[i].closeTime.toDate());
            // }
           // console.log("open survey",openSurveys);
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
                 //  return  b.closeTime._seconds -a.closeTime._seconds;
                    return new Date(b.closeTime) - new Date(a.closeTime)
                 })
            //      for (var i = 0; i < closeSurveys.length; i++){
            //        closeSurveys[i].closeTime = (closeSurveys[i].closeTime.toDate());
            //    }


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
            //   console.log("survey",surveys);
             //  console.log("surveys not found");
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

cr.get('/targetAudience', (req,res) =>{

    db.collection('TargetAudience').doc('K0MLUyw4nTMYMyVhrruy').get()
    .then(doc =>{
        let data = doc.data();
        data.id = doc.id;
        data.layout = false;
      //  console.log(data);
        res.render('./customerViews/targetAudience',data);
    })
    .catch( err =>{
        console.log("target audience",err);

    })

})
cr.post('/updateTA', async (req,res)=>{
    //console.log('updateTA');
   // let atr = req.param('ta_atr');
   // console.log(atr);
   // let id = req.param('id');
    let ta ={};
    if(atr == 'location'){
        ta.location = req.body.location;
    }
    else if(atr == 'gender'){
        ta.gender = req.body.gender;
    }
    else if(atr == 'age'){
        ta.ageR_1 = req.body.range_1;
        ta.ageR_2 = req.body.range_2;
        }
   else if(atr == 'education'){
        ta.education = req.body.education;
   }
   else if(atr == 'marital_status'){
       //console.log('marital if');
       ta.marital_status = req.body.Status;
   }
   else if(atr == 'income'){
    //console.log('marital if');
    ta.incomeR_1 = req.body.incomeR_1;
    ta.incomeR_2 = req.body.incomeR_2;
}
else if(atr == 'occupation'){
    //console.log('marital if');
    ta.occupation = req.body.occupation;
}
else if(atr == 'religion'){
    //console.log('marital if');
    ta.religion = req.body.religion;
}
    else {}
        console.log(ta);
    console.log(ta);
   await db.collection('TargetAudience').doc(id).set(ta,{merge:true});
    res.redirect('/customer/targetaudience');

})

cr.get('/buypackage', (req,res) =>{

    let id = 'K0MLUyw4nTMYMyVhrruy';
    db.collection('Survey').doc(id).get()
    .then(snapshot =>{
        //console.log(Object.getOwnPropertyNames(snapshot.data().questions).length);
        let totalQuestions = Object.getOwnPropertyNames(snapshot.data().questions).length;
        data ={id:id, totalQuestions:totalQuestions, layout:false};
        console.log(data);
        console.log(req.session.uid);
        db.collection('Customers').doc(req.session.uid).get()
        .then(snap=>{
            console.log(snap.id,'=>',snap.data());

            data.balance = snap.data().balance;
            console.log(data);
            res.render('./customerViews/buyPackage',data);
        })
        .catch(err =>{
            console.log(err);
        })


    })
    // if(req.session.email){
    //     //dataset = {email: req.session.email, uid: req.session.uid};
    //     //console.log(req.session.email);
    //     //console.log("welcome customer sceen")
    // }
    // else res.redirect('/customer/login');

})


cr.get('/createsurvey',(req,res)=>{
    res.render('./customerViews/builder');
});
cr.get('/result',(req,res)=>{
    res.render('./customerViews/results');
});


cr.post('/send/:id',(req,res)=>{
    let id = req.params.id;
    console.log(id);
  //  console.log(id);
    //console.log(id.toString());
    //let basic_res = req.body.basic_res;
    let basic = parseInt(req.body.basic_res);
    let standard = parseInt(req.body.standard_res);
    let premium = parseInt(req.body.premium_res);
    total_res = basic +standard + premium;
    let closeTime = new Date(req.body.closeTime);
    console.log(closeTime);

    let data = {
        package: {
            basic: basic,
            standard: standard,
            premium: premium
        },
        closeTime: req.body.closeTime,
        total_response:total_res,
        comp_response: 0,
        status:'open',



    }
    db.collection('Survey').doc(id).update(data);
    //console.log(data);
    res.redirect('/customer/openSurvey');

})

module.exports = cr;