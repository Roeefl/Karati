const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const commentSchema = new Schema(
    {
        userID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: false,
            default: 'John Doe'
        },
        content: {
            type: String,
            required: true
        },
        dateAdded: {
            type: Date,
            required: true
        }
    }
);

module.exports = commentSchema;