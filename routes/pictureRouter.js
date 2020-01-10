var express = require('express');
var bodyParser = require('body-parser');
var Picture = require('../models/Picture');
var User = require('../models/User');

var pictureRouter = express.Router();
pictureRouter.use(bodyParser.json());


pictureRouter.route('/')
    .get((req, res, next) => {

        var num = req.query.num;

        Picture.aggregate([{ $sample: { size: num } }])
            .then((pictures) => {
                res.status(200);
                res.send({
                    error: false,
                    errorMessage: 'ERR_NONE',
                    pictures: pictures
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(200);
                res.send({
                    error: false,
                    errorMessage: 'ERR_PICTURES'
                })
            });

    })
    .post((req, res, next) => {
        const accessToken = req.query.accessToken;
        const picture = req.body.picture;
        const title = req.body.title;

        Picture.create({
            content: picture,
            title: title
        })
            .then((picture) => {
                const pictureId = picture.get('_id');
                User.updateOne({
                    accessToken: accessToken
                }, {
                        $push: {pictures: pictureId}
                }, (err, doc) => {
                        if (err) {
                            console.error(err);
                            res.status(200);
                            res.send({
                                error: true,
                                errorMessage: 'ERR_INSERT_PIC_ID'
                            });
                        }
                        else {
                            Picture.updateOne({
                                pictureId: pictureId
                            }, {
                                uploader: doc.get('_id')
                            })
                                .then((result) => {
                                    res.status(200);
                                    res.send({
                                        error: false,
                                        errorMessage: 'ERR_NONE'
                                    })
                                })
                                .catch((error) => {
                                    console.error(error);
                                    res.status(200);
                                    res.send({
                                        error: true,
                                        errorMessage: 'ERR_INSERT_PIC_UPLOADER'
                                    });
                            })
                            
                        }
                })

            })
            .catch((error) => console.error(error));
    });

pictureRouter.route('/:pictureId')
    .get((req, res, next) => {

    })
    .delete((req, res, next) => {

    });

module.exports = pictureRouter;