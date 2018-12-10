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
        }
    }
);

const swipeSchema = new Schema(
    {
        bookID: {
            type: String,
            required: true
        },
        like: {
            type: Boolean,
            required: true
        },
        dateAdded: {
            type: Date,
            required: false
        }    
    }
);

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
        email: {
            type: String,
            required: true
        },
        created: {
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
        }
    }
);

mongoose.model('users', userSchema);