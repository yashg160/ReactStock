var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PictureSchema = new Schema({
    id: String,
    content: String,
    owner: String
});

var Picture = mongoose.model('Picture', PictureSchema, 'Pictures');

module.exports = Picture