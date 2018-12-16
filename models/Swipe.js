const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const swipeSchema = new Schema(
    {
        bookID: {
            type: String,
            required: true
        },
        like: {
            type: Boolean,
            required: true,
            default: false
        },
        dateAdded: {
            type: Date,
            required: false
        }    
    }
);

module.exports = swipeSchema;

