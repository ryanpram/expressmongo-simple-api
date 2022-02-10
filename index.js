const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();


var routes = require('./routes/index.js');

//Middleware 
app.use(bodyParser());


app.use('/', routes)


// connect to DB
mongoose.connect('mongodb://localhost:27017/sample_db')
let db = mongoose.connection

db.on('error', console.error.bind(console, 'Database connect error'));
db.once('open', () =>{
    console.log('Database is Connected');
});

//listen 
app.listen(3003,() => {
    console.log('Server running in 3003');
})