const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const chatMsg = new Schema (
    {
        sender: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        whenSent: {
            type: Date,
            required: true
        }
    }
);

module.exports = chatMsg;