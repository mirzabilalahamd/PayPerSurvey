let openSurveys = [];
let closeSurveys = [];
let draftSurveys = [];
let db = require('../connection').db;
async function getSurveyList(id){
    return db.collection('Customers').doc(id).get();
     
 }
 async function getSurvey(id){
     return db.collection('Survey').doc(id).get();
 }
const start = async ()=>{
  
    let survey;
    let snapshot = await getSurveyList('470bnBREgYBB2QupJrmR');
  
    console.log(snapshot.data().surveylist);
  
    for (const id of snapshot.data().surveylist) {
        survey = await getSurvey(id);
        console.log(survey.id,'=>',survey.data());
        doc = survey.data();
        if(doc.status =='draft') draftSurveys.push(doc);
        else if (doc.status == 'open') openSurveys.push(doc);
        else if (doc.status == 'close') closeSurveys.push(doc);
        else console.log(doc.id, "does not match the status");
    }

    // snapshot.data().surveylist.forEach( async (id) => {
    //         survey = await getSurvey(id);
    //         console.log(survey.id,'=>',survey.data());
    // });

    // console.log("after");
    // console.log(draftSurveys);
    // console.log(openSurveys);
    // console.log(closeSurveys);
}
start();
exports.openSurveys = openSurveys;
exports.draftSurveys = draftSurveys;
exports.closeSurveys = closeSurveys;
