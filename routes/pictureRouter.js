var express = require('express');
var bodyParser = require('body-parser');
var Picture = require('../models/Picture');

var pictureRouter = express.Router();
pictureRouter.use(bodyParser.json());

pictureRouter.route('/')
    .get((req, res, next) => {
        
    })
    .post((req, res, next) => {

    });

pictureRouter.route('/:pictureId')
    .get((req, res, next) => {

    })
    .delete((req, res, next) => {

    });

module.exports = pictureRouter;