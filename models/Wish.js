const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const wishSchema = new Schema(
    {
        bookID: {
            type: String,
            required: true
        },
        goodreadsID: {
            type: Number,
            required: false
        },
        dateAdded: {
            type: Date,
            required: false
        }
    }
);

module.exports = wishSchema;