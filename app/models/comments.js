let mongoose = require('mongoose'),
    schema = mongoose.Schema;

var userSchema = new schema({
    feed_id :{
        type:schema.Types.ObjectId,
        required:true
    },
    user_email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    posted_on: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    updated_on: {
        type: Number,
    },
});

const userSchemaObject = mongoose.model('comments', userSchema, 'comments');


module.exports = userSchemaObject;