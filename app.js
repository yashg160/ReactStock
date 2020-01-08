var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

const connect = mongoose.connect(config.mongoUrl);

connect.then(db => {
    console.log('Connected to server correctly');
    },
    err => console.error(err));

app.all('/', (req, res, next) => {
    res.send({ message: 'Congratulations! Server is working as expected.' });
})

module.exports = app;