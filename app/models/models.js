const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
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
    }
});

module.exports = {

    User: mongoose.model('User', userSchema),

    Book: mongoose.model('Book', {
        goodreadsID: Number,
        author: String,
        title: String,
        created: Date,
        imageURL: String
    }),
      
    OwnedBook: mongoose.model('OwnedBook', {
        userID: String,
        bookID: String
    }),
    
    Swipe: mongoose.model('Swipe', {
        when: Date,
        userID: String,
        bookID: String,
        like: Boolean
    })

};