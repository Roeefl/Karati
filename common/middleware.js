const mongoose = require("mongoose");
const User = mongoose.model("users");
const Book = mongoose.model('books');

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
      req.currentUser = await User.findById( req.session.passport.user );

      return next();
    }

    req.currentUser = null;
    return next();
  },

  ensureUserOwnsBook: async function(req, res, next) {
    User.findById(
        req.session.passport.user,
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

  createProposalObj: async function(match, owner, proposedByMe, myBook, hisBook, hisBookImageURL) {
    let chatWithUsernames = [];
    
    for (let msg of match.chat) {
      const fetchSenderName = await msg.senderName;
      
      let cloneMsg = {
        sender: msg.sender,
        message: msg.message,
        whenSent: msg.whenSent,
        senderName: fetchSenderName
      }

      chatWithUsernames.push(cloneMsg);
    }

    // console.log(chatWithUsernames);

    return {
      proposalId: match._id,
      status: match.status,
      chat: chatWithUsernames,
      lastStatusDate: match.lastStatusDate,
      owner,
      proposedByMe,
      myBook,
      hisBook,
      hisBookImageURL
    };
  },

  convertMatchToProposal: async function(match, currUserId) {
    const owner = (match.firstUser.userID == currUserId ? match.secondUser : match.firstUser);
    const ownerInfo = await User.findById(owner.userID);
    const myself = (match.firstUser.userID == currUserId ? match.firstUser : match.secondUser);
    const myBookInfo = await Book.findById(owner.bookID);
    const hisBookInfo = await Book.findById(myself.bookID);

    const proposal = await this.createProposalObj( match, ownerInfo.username, myself.proposed, myBookInfo.title, hisBookInfo.title, hisBookInfo.imageURL );
    return proposal;
  },

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  shuffleArray: function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    
    return a;
  }
};
