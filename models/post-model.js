const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    posttitle: {
        type: String,
        required: true
    },
    postbody: {
        type: String,
        required: true
    },
    postimage: {  
        type: String,
        required: true
    }
}, { timestamps: true });

// +++++++++++++++++++++++++++++++
// { timestamps: true } 
// Date and Time

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
