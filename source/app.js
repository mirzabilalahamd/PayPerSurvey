const express = require('express')
const app = express()
const port = 3000
const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('./paypersurvey-67687-firebase-adminsdk-1q4lk-30af14b62d.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

let db = admin.firestore();


app.get('/', (req, res) => {
    db.collection('Customers').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

  
    res.send('Hello World!');
});

app.listen(port, () => console.log(` PayPerSurvey app listening on port ${port}!`))