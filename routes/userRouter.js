var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/User');
var Picture = require('../models/Picture');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/login')
    .get((req, res, next) => {
        var query = req.query

        User.findOne({
            accessToken: query.accessToken
        }, (err, success) => {
                if (err) {
                    res.status(200);
                    res.statusMessage = 'ERR_FIND_USER';
                    res.send({
                        error: true,
                        errorMessage: 'ERR_FIND_USER'
                    });
                }
                else {
                    if (success == null) {
                        res.status(200);
                        res.statusMessage = 'ERR_TOKEN';
                        res.send({
                            error: true,
                            errorMessage: 'ERR_TOKEN'
                        });
                    }
                    else {
                        console.log(success);
                        res.status(200);
                        res.statusMessage = 'ERR_NONE';
                        res.send({
                            error: false,
                            errorMessage: 'ERR_NONE',
                            accessToken: query.accessToken,
                            profile: {
                                givenName: success.get('name').given,
                                familyName: success.get('name').family,
                                imageUrl: success.get('imageUrl'),
                                email: success.get('email'),
                                pictures: success.get('pictures')
                            }
                        });
                    }
                }
        })
    })
    .post((req, res, next) => {
        var body = req.body

        User.findOne({
            googleId: body.googleId
        },
            (error, success) => {
                if (error) {
                    res.status(200);
                    res.statusMessage = 'ERR_LOGIN'
                    res.send({ error: true });
                }
                else {
                    console.log(success);
                    if (success == null) {
                        User.create(body, (err, createdSuccess) => {
                            if (err) {
                                res.status(200);
                                res.statusMessage = 'ERR_LOGIN'
                                res.send({ error: true });
                            }
                            else {
                                console.log(createdSuccess);
                                res.status(200);
                                res.statusMessage = 'ERR_NONE';
                                res.send({
                                    error: false,
                                    accessToken: body.accessToken,
                                    userCreated: true
                                });
                            }
                        });
                    }
                    else {
                        console.log(success);
                        User.updateOne({
                            googleId: body.googleId
                        }, {
                            accessToken: body.accessToken
                        }, (err, updateSuccess) => {
                            if (err) {
                                res.status(200);
                                res.statusMessage = 'ERR_UPDATE_TOKEN'
                                res.send({ error: true });
                            }
                            else {
                                console.log(updateSuccess);
                                res.status(200);
                                res.statusMessage = 'ERR_NONE';
                                res.send({
                                    error: false,
                                    accessToken: body.accessToken,
                                    userCreated: false
                                });
                            }
                        });
                        
                    }
                }
            });
    });

userRouter.route('/pictures')
    .get((req, res, next) => {
        var query = req.query;

        User.findOne({
            accessToken: query.accessToken
        }, (err, doc) => {
                if (err) {
                    res.status(200);
                    res.send({ error: true, errorMessage: 'ERR_USER_PICTURES' });
                }
                else {
                    var pictureIds = doc.get('pictures');
                    let pictures = [];

                    for (i = 0; i < pictureIds.length; i++) {

                        Picture.findById(pictureIds[i], (err, pic) => {
                            if (!err) {
                                pictures.push({
                                    content: pic.get('content'),
                                    title: pic.get('title')
                                });
                            }
                            else {
                                res.status(200);
                                res.send({error: true, errorMessage: 'ERR_PICTURE'})
                            }
                        });
                    }

                    res.status(200);
                    res.send({
                        error: false,
                        errorMessage: 'ERR_NONE',
                        pictures: pictures
                    });
                }
        })
    });

module.exports = userRouter;