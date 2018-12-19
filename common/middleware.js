const mongoose = require("mongoose");
const User = mongoose.model("users");
const Book = mongoose.model('books');
const ObjectId = mongoose.Types.ObjectId;

const errors = require("../config/errors");

parseAuthorName = (book) => {
  if (book && book.authors && book.authors.author) {
    if (Array.isArray(book.authors.author)) {
      // Array of authors - return name of first
      return book.authors.author[0].name;
    } else {
      // Not array - return  name of single author
      return book.authors.author.name;
    }
  } else {
    return "AUTHOR_NAME_NOT_FOUND";
  }
};

const bookGenres =  [   'adventure', 'action', 'fantasy', 'fiction', 'classics', 'science', 'psychology', 'nonfiction', 'mystery', 'thriller', 
                        'romance', 'biography', 'history', 'contemporary', 'horror' ];

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
    let genres = [];

    console.log(result.book.popular_shelves.shelf);
    for (let s = 0; s < result.book.popular_shelves.shelf.length; s++) {
      let genre = result.book.popular_shelves.shelf[s].name.toLowerCase();

      // console.log(genre);

      if (bookGenres.find( g => g === genre ) && result.book.popular_shelves.shelf[s].count >= 100 ) {
        genres.push(genre);
      }
    };

    // console.log(genres);

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
          genres: genres
        }
    );
  }
};
