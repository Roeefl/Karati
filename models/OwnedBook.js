const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const ownedBookSchema = new Schema(
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
        },
        available: {
            type: Boolean,
            required: false,
            default: true
        }
    }
);

module.exports = ownedBookSchema;