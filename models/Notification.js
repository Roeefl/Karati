const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const notification = new Schema (
    {
        content: {
            type: String,
            required: true,
            default: 'New Notification'
        },
        dateCreated: {
            type: Date,
            required: true
        },
        seen: {
            type: Boolean,
            required: false,
            default: false
        }
    }
);

module.exports = notification;