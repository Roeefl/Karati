const mongoose = require("mongoose");
const User = mongoose.model("users");
const Book = mongoose.model('books');
const ObjectId = mongoose.Types.ObjectId;

const errors = require("../config/errors");

const parseAuthorName = require('./parseAuthorName');
const parseBookGenres = require('./parseBookGenres');

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.end(
      JSON.stringify({
        error: errors.NOT_LOGGED_IN
      })
    );
  },

  getUser: function(userID) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          _id: new ObjectId(userID)
        },
        function(err, foundUser) {
          if (err || !foundUser) {
            reject(err);
            return;
          }

          resolve(foundUser);
        }
      );
    });
  },

  parseBookDataObjFromGoodreads: function(goodreadsID, result) {
    let genres = parseBookGenres(result.book.popular_shelves);

    return new Book(
      {
          goodreadsID: goodreadsID,
          author: parseAuthorName(result.book),
          title: result.book.title,
          createdAt: Date.now(),
          lastMarkedAsOwned: Date.now(),
          imageURL: result.book.image_url,
          description: result.book.description,
          numOfPages: result.book.num_pages,
          publicationYear: result.book.publication_year,
          averageRating: result.book.average_rating,
          genres: genres,
          comments: []
        }
    );
  }
};
