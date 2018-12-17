const mongoose = require('mongoose');
const User = mongoose.model('users');
const ObjectId = mongoose.Types.ObjectId;
const errors = require('../config/errors');

module.exports = {

    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        
        res.end( JSON.stringify(
            {
                'error': errors.NOT_LOGGED_IN
            }
        ));
    },

    getUser: function (userID) {
        return new Promise( (resolve, reject) => {
            User.findOne(
                {
                _id: new ObjectId(userID)
                }, function( err, foundUser) {

                if (err || !foundUser) {
                    reject(err);
                    return;
                }
                
                resolve(foundUser);
            });
        });
    },

    parseAuthorName: function (book) {
        if (book && book.authors && book.authors.author) {
            if (Array.isArray(book.authors.author)) {
            // Array of authors - return name of first
            return book.authors.author[0].name;
            } else {
            // Not array - return  name of single author
            return book.authors.author.name
            }
        } else {
            return 'AUTHOR_NAME_NOT_FOUND';
        }
    }

}