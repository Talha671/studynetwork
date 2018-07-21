let mongoose = require('mongoose'),
    schema = mongoose.Schema;

var userSchema = new schema({
    user_email: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    posted_on: {
        type: Number,
        required: true,
        default:Date.now()
    },
    tag:{
        type:String,
    },
    updated_on:{
        type:Number,
    },
});

const userSchemaObject = mongoose.model('newsfeeds', userSchema,'newsfeeds');


module.exports = userSchemaObject;