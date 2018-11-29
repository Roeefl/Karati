const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

let ownedBookSchema = new Schema( {
    bookID: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        required: false
    }
});

let swipeSchema = new Schema( {
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
});

let userSchema = new Schema( {
    oauthID: {
        type: Number,
        required: true
    },
    name: {
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
});

let bookSchema = new Schema( {
    goodreadsID: {
        type: Number,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: false
    },
    imageURL: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    numOfPages: {
        type: Number,
        required: false
    }
});

/*
    *** Status codes ***
    3 - Pending
    4 - Approved by firstUser
    5 - Approved by secondUser
    6 - Approved by both users
*/
let matchSchema = new Schema ( {
    firstUser: {
        userID: {
            type: String,
            requireD: true
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
    }
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Book: mongoose.model('Book', bookSchema),
    Match: mongoose.model('Match', matchSchema)
};