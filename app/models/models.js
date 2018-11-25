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
    }
});

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
        requireD: true
    }
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Book: mongoose.model('Book', bookSchema),
    Match: mongoose.model('Match', matchSchema)
};