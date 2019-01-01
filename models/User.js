const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const ownedBookSchema = require('./OwnedBook');
const swipeSchema = require('./Swipe');
const notificationSchema = require('./Notification');

const userSchema = new Schema (
    {
        oauthID: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        fullName: {
            first: {
                type: String,   
                required: false
            },
            last: {
                type: String,
                required: false
            }
        },
        bio: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: false
        },
        lastLogin: {
            type: Date,
            required: false
        },
        ownedBooks: {
            type: [ownedBookSchema],
            required: false
        },
        swipes: {
            type: [swipeSchema],
            required: false
        },
        notifications: {
            type: [notificationSchema],
            required: false
        },
        passedIntro: {
            type: Boolean,
            required: true,
            default: false
        }
    }
);

mongoose.model('users', userSchema);