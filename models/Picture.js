var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    content: String,
    title: String,
    uploader: {type: String, default: null}
});

var Picture = mongoose.model('Picture', PictureSchema, 'Pictures');

module.exports = Picture