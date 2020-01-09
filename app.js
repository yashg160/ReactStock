var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var mongoose = require('mongoose');

var config = require('./config');

var userRouter = require('./routes/userRouter');

var app = express();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

mongoose.connect(config.mongoUrl)
    .then((db) => console.log('Connected to server'))
    .catch((err) => console.error('Failed to connect to server ', err));

app.use('/user', userRouter);

app.all('/', (req, res, next) => {
    res.send({ message: 'This route is after /user. Create an endpoint.' });
})

module.exports = app;