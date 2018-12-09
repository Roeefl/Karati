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

/* *** Status codes ***
    3 - Pending
    4 - Approved by firstUser
    5 - Approved by secondUser
    6 - Approved by both users
*/
const matchSchema = new Schema (
    {
        firstUser: {
            userID: {
                type: String,
                required: true
            },
            bookID: {
                type: String,
                required: true
            }
        },
        secondUser: {
            userID: {
                type: String,
                requireD: true
            },
            bookID: {
                type: String,
                required: true
            }
        },
        dateMatched: {
            type: Date,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        chat: {
            type: [chatMsg],
            required: false
        }
    }
);

mongoose.model('matches', matchSchema);