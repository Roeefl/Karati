const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatMsg = require("./ChatMsg");
const matchStatus = require("../config/matchStatus");

/**
 * See matchStatus codes in config/matchStatus.js
 */
const matchSchema = new Schema({
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
});

matchSchema.statics.findByStatus = function(status, cb) {
    return this.find({ status }, cb);
};

matchSchema.statics.findByUserID = function(userID, cb) {
    return this.find({ 
        $or: [
            { 'firstUser.userID': userID },
            { 'secondUser.userID': userID }
          ]
    }, cb);
};

matchSchema.statics.findActiveByUserID = function(userID, cb) {
    return this.find({ 
        "status": {
            $in: [
                matchStatus.PROPOSED, matchStatus.ACCEPTED
            ]
        },
        $or: [
            { 'firstUser.userID': userID },
            { 'secondUser.userID': userID }
          ]
    }, cb);
};

matchSchema.statics.findMatchOfEitherUser = function({ firstUserId, secondUserId, firstBookId, secondBookId }, cb) {
    return this.findOne({
        $or: [
            {
                $and: [
                    { 'firstUser.userID': firstUserId },
                    { 'firstUser.bookID': firstBookId },
                    { 'secondUser.userID': secondUserId },
                    { 'secondUser.bookID': secondBookId }
                ]
            },
            {
                $and: [
                    { 'firstUser.userID': secondUserId },
                    { 'firstUser.bookID': secondBookId },
                    { 'secondUser.userID': firstUserId },
                    { 'secondUser.bookID': firstBookId }
                ]
            }
        ]
    }, cb);
};

mongoose.model("matches", matchSchema);
