const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sessions
const session = require('express-session');
app.use(session({
    secret:"secret",
    saveUninitialized: true,
    resave:true
}))
//setting template engine
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//set static files
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static('public'));
app.use(express.static('js'));



//routes folders
const cusRoutes = require('./routes/customer');
app.use('/customer',cusRoutes);

//databse connection
let db = require('./connection').db;
let firebase = require('./authConnection').firebase;

// let doc = db.collection('Survey').doc('470bnBREgYBB2QupJrmR');

// let observer = doc.onSnapshot(docSnapshot => {
//   console.log(`Received doc snapshot: ${docSnapshot}`);
//   console.log(docSnapshot.data().status)
//   // ...
// }, err => {
//   console.log(`Encountered error: ${err}`);
// });

function getSurveyList(id){
   return db.collection('Customers').doc(id).get();

    
}
async function getSurvey(id){
    return db.collection('Survey').doc(id).get();
}

// async function getSurveys(id){
//     return Promise( (resolve, reject) =>{
//         let openSurveys = [];
//     let closeSurveys = [];
//     let draftSurveys = [];
//     let survey;
//     let snapshot = await getSurveyList('470bnBREgYBB2QupJrmR');
  
//     console.log(snapshot.data().surveylist);
  
//     for (const id of snapshot.data().surveylist) {
//         survey = await getSurvey(id);
//         console.log(survey.id,'=>',survey.data());
//         doc = survey.data();
//         if(doc.status =='draft') draftSurveys.push(doc);
//         else if (doc.status == 'open') openSurveys.push(doc);
//         else if (doc.status == 'close') closeSurveys.push(doc);
//         else console.log(doc.id, "does not match the status");
//     }
//     })
// }

// function survey(req,res,status,callback){


// }

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
            console.log(survey.id)
            let s =survey.data();
            s.id = survey.id;
            if(survyesIds.includes(survey.id) && doc.status == 'draft') { draftSurveys.push(survey.data()); console.log("draft") }
            else if(survyesIds.includes(survey.id) && doc.status == 'open') {openSurveys.push(s); console.log("open")}
            else if(survyesIds.includes(survey.id) && doc.status == 'close') {closeSurveys.push(survey.data());console.log("close")}
            else console.log(survey.id,"does not match");
           // console.log(survey.id);

        });
    console.log(draftSurveys);
    console.log(openSurveys);
    console.log(closeSurveys);
    
    
    if(status =='draft'){
      if(!draftSurveys.length) callback(null,draftSurveys)//resolve(draftSurveys);
      else  callback('error',draftSurveys)//reject("draft surveys not found");  
    } 
    else if(status =='open'){
        let surveys = {"survey": openSurveys, };
        if(!openSurveys.length){ let surveys = {"survey": openSurveys, }; callback(null,surveys) }
       else callback(0,surveys) 
      } 
      else if(status =='close'){
        if(!closeSurveys.length) callback(null,closeSurveys)
        else callback(0 ,closeSurveys) 
      } 
      else callback(0 ,'error')

     

}
app.get('/', async (req, res) => {

    //let a = {'a':'a', 'b':'b'}
  //  a.c = 'c';
    console.log({'a':'a', 'b':'b'}.c='c');
    getSurveys('470bnBREgYBB2QupJrmR','open', (err,surveys) =>{
        //if(!err) console.log(err);
        console.log("survey",surveys);
    })

    // let openSurveys = [];
    // let closeSurveys = [];
    // let draftSurveys = [];
    // let snapshot = await getSurveyList('470bnBREgYBB2QupJrmR');
    // console.log(snapshot.data().surveylist);
    // //console.log((snapshot.data().surveylist).includes('K0MLUyw4nTMYMyVhrruy'));
    
    // let survyesIds = snapshot.data().surveylist;
    // let surveySnapshot=await db.collection('Survey').get()
    //     surveySnapshot.forEach(survey =>{
    //         let doc = survey.data();
    //         console.log(survey.id)
    //         if(survyesIds.includes(survey.id) && doc.status == 'draft') draftSurveys.push(survey.id);
    //         else if(survyesIds.includes(survey.id) && doc.status == 'open') openSurveys.push(survey.id);
    //         else if(survyesIds.includes(survey.id) && doc.status == 'close') closeSurveys.push(survey.id);
    //         else console.log(survey.id,"does not match");
    //        // console.log(survey.id);

    //     });


    //console.log("surveys", surveys[0].id);
    // for (const survey of surveys) {
    //         console.log(survey.id,'=>',survey.data());
    // }

    // for (const id of snapshot.data().surveylist) {
    //     survey = await getSurvey(id);
    //     console.log(survey.id,'=>',survey.data());
    //     doc = survey.data();
    //     if(doc.status =='draft') draftSurveys.push(doc);
    //     else if (doc.status == 'open') openSurveys.push(doc);
    //     else if (doc.status == 'close') closeSurveys.push(doc);
    //     else console.log(doc.id, "does not match the status");
    // }

    // snapshot.data().surveylist.forEach( async (id) => {
    //         survey = await getSurvey(id);
    //         console.log(survey.id,'=>',survey.data());
    // });

     console.log("after");
    // console.log(draftSurveys);
    // console.log(openSurveys);
    // console.log(closeSurveys);

    
//    getSurveyList('470bnBREgYBB2QupJrmR').then((result) => {
//        console.log(result.id);
//    }).catch((err) => {
//        console.log(err);
       
//    });
    //  console.log("await",snapshot.id, '=>',snapshot.data());
    // console.log("after await")

    // let snapshot = await db.collection('Customers').doc('470bnBREgYBB2QupJrmR').get();
    // console.log(snapshot.id);
    
//    await db.collection('Customers').doc('470bnBREgYBB2QupJrmR').get()
//     .then(snapshot =>{
//         // let surveyList = snapshot.data().surveyList; 
//          console.log(snapshot.data().surveylist);
         
//          snapshot.data().surveylist.forEach( async (id)=>{
//             console.log("",id);
        
//             await db.collection('Survey').doc(id).get()
//             .then(sdoc =>{
//                 console.log("sid",sdoc.id);
//                 if(sdoc.status =='draft') draftSurveys.push(sdoc.data());
//                 if(sdoc.status == 'open') openSurveys.push(sdoc.data());
//                 if(sdoc.status == 'closed') closedSurveys.push(sdoc.data());
//                 else console.log("do not match the status", sdoc.id);
//            })
//            .catch(err=>{
//             console.log(err);
//         })
           
//         })
//     })
//     .catch(err=>{
//         console.log(err);
//     })
   

    // let customerRef = db.collection('Customers').doc('470bnBREgYBB2QupJrmR');
    // let data;
    // let getDoc = await customerRef.get()
    // .then(doc => {
    //     if(!doc.exists) console.log('document not exits');
    //     else{
    //         console.log("doc", doc.data());
    //         data = doc.data();
    //     } 

    // })
    // .catch(err =>{
    //     console.log("error",err);
    // });
    // console.log("customer id",data.surveylist);

    // let surveyRef = db.collection('Survey');//.doc(data.surveylist[0])
    // let a =  surveyRef.where(firebase.firestore.FieldPath.documentId(), '==', 'K0MLUyw4nTMYMyVhrruy').where("status",'==','draft').get()
    // .then(snapshot =>{
    //     if(snapshot.empty){
    //         console.log('document not exist');
    //     } 
    //     else{
    //         snapshot.forEach((doc =>{
    //             console.log('survey id',doc.id);
    //         }))
            
    //     }
    //    // console.log(doc.id);
    // })
    // .catch(err =>{
    //     console.log(err);
    // });

    res.render('index');



});




app.listen(port, () => console.log(` PayPerSurvey app listening on port ${port}!`))