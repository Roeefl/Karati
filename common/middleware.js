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

    res.status(401).send(
      {
        error: errors.NOT_LOGGED_IN
      }
    );
  },

  getUser: async function(req, res, next) {
    if (req && req.session && req.session.passport && req.session.passport.user) {
      req.currentUser = await User.findOne( 
        { _id: new ObjectId(req.session.passport.user) } 
      );

      return next();
    }

    req.currentUser = null;
    return next();
  },

  ensureUserOwnsBook: async function(req, res, next) {
    User.findOne(
      {
        _id: new ObjectId(req.session.passport.user)
      },
      function(err, currentUser) {
        if (err || !currentUser) {
          console.log('SUPER ERROR');
        }

        if ( currentUser.ownedBooks.find( book =>
          book.bookID === req.body.bookID 
        )) {
          return next();
        };

        res.status(403).send(
          {
            error: errors.DOES_NOT_OWN_BOOK
          }
        );
      }
    );
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
  },

  groupBy: function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  },

  reverseNotifications: function(user) {
    if (!user.notifications) {
      return user;
    }
    
    user.notifications.reverse();
    return user;
  },

  createProposalObj: function(match, owner, proposedByMe, myBook, hisBook) {
    return {
      proposalId: match._id,
      status: match.status,
      chat: match.chat,
      lastStatusDate: match.lastStatusDate,
      owner,
      proposedByMe,
      myBook,
      hisBook
    };
  },

  convertMatchToProposal: async function(match, currUserId) {
    const owner = (match.firstUser.userID == currUserId ? match.secondUser : match.firstUser);
    const ownerInfo = await User.findById(owner.userID);
    const myself = (match.firstUser.userID == currUserId ? match.firstUser : match.secondUser);
    const myBookInfo = await Book.findById(owner.bookID);
    const hisBookInfo = await Book.findById(myself.bookID);

    return this.createProposalObj( match, ownerInfo.username, myself.proposed, myBookInfo.title, hisBookInfo.title );
  }
};
