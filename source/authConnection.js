const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyABBcOVUSvftSn2xvep4CGskkD4JtnS0PM",
    authDomain: "paypersurvey-67687.firebaseapp.com",
    databaseURL: "https://paypersurvey-67687.firebaseio.com",
    projectId: "paypersurvey-67687",
    storageBucket: "paypersurvey-67687.appspot.com",
    messagingSenderId: "836102623283",
    appId: "1:836102623283:web:c203cbe49f61e4f9"
  };
firebase.initializeApp(firebaseConfig);
exports.firebase = firebase;