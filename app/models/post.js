var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Post', new Schema({
    username: String,
    timestamp: { type: Date, default: Date.now },
    head: String,
    sub_head: String,
    description: String,
    like: Array,
    image: String
}));
