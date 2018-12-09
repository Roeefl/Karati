const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const bookSchema = new Schema(
    {
        goodreadsID: {
            type: Number,
            required: false
        },
        author: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: false
        },
        imageURL: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        numOfPages: {
            type: Number,
            required: false
        }
    }
);

mongoose.model('books', bookSchema);