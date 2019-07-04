const express = require('express');
const app = express();
const port = 3000;

//setting template engine
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//set static files
app.use(express.static('public'));

//routes folders
const cusRoutes = require('./routes/customer');

//databse connection
let db = require('./connection').db;


app.get('/', (req, res) => {
    // db.collection('Customers').get()
    // .then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     console.log(doc.id, '=>', doc.data());
    //   });
    // })
    // .catch((err) => {
    //   console.log('Error getting documents', err);
    // });
    res.render('index');
});
app.use("/customer",cusRoutes);

app.listen(port, () => console.log(` PayPerSurvey app listening on port ${port}!`))