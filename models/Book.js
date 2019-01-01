const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const commentSchema = require ('./Comment');

const bookSchema = new Schema(
    {
        goodreadsID: {
            type: Number,
            required: false
        },
        author: {
            type: String,
            required: true,
            default: 'John Doe'
        },
        title: {
            type: String,
            required: true,
            default: 'Tales of Haze Mountain'
        },
        createdAt: {
            type: Date,
            required: false
        },
        lastMarkedAsOwned: {
            type: Date,
            required: false
        },
        imageURL: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false,
            default: 'No Description Available'
        },
        numOfPages: {
            type: Number,
            required: false
        },
        publicationYear:{
            type: String,
            required: false
        },
        averageRating: {
            type: Number,
            required: false
        },
        genres: {
            type: [String],
            required: false,
            default: []
        },
        comments: {
            type: [commentSchema],
            required: false,
            default: []
        },
        likes: {
            type: Number,
            required: false,
            default: 0
        }
    }
);

mongoose.model('books', bookSchema);