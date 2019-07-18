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

//databse connection
let db = require('./connection').db;
let firebase = require('./authConnection').firebase;


app.get('/', async (req, res) => {

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

    app.use("/customer",cusRoutes);



});




app.listen(port, () => console.log(` PayPerSurvey app listening on port ${port}!`))