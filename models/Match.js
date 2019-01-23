const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const chatMsg = require('./ChatMsg');

const matchStatus = require('../config/matchStatus');

/**
 * See matchStatus codes in config/matchStatus.js
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
            },
            proposed: {
                type: Boolean,
                required: false,
                default: false
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
            },
            proposed: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        dateMatched: {
            type: Date,
            required: true
        },
        status: {
            type: Number,
            required: true,
            default: matchStatus.PENDING
        },
        lastStatusDate: {
            type: Date,
            required: false
        },
        chat: {
            type: [chatMsg],
            required: false
        }
    }
);

mongoose.model('matches', matchSchema);