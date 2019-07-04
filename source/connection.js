const admin = require('firebase-admin');
const functions = require('firebase-functions');
let serviceAccount = require('./paypersurvey-67687-firebase-adminsdk-1q4lk-30af14b62d.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

let db = admin.firestore();
exports.db=db;