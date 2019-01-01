const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const errors = require('../config/errors');
const middleware = require('../common/middleware');

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

module.exports = (app) => {
    app.get('/api/myProfile', middleware.ensureAuthenticated, async (req, res) => {
      const currUser = await User.findById(req.session.passport.user);

      res.end( JSON.stringify( currUser ));
    });

    app.get('/api/mySwipeHistory', middleware.ensureAuthenticated, async (req, res) => {
      let currentUser = await middleware.getUser(req.session.passport.user);

      let bookData = await Book.find(
        {
            "_id": {
                "$in": 
                    currentUser.swipes.map( swipe => swipe.bookID )
            }
        }
      );

      let mySwipeHistory = [];

      for (let s = currentUser.swipes.length - 1; s >= 0; s--) { 
        let swipe = currentUser.swipes[s];
        
        mySwipeHistory.push(
          {
            _id: swipe._id,
            bookID: swipe.bookID,
            liked: swipe.like,
            dateAdded: swipe.dateAdded,
            book: bookData.find(book =>
              book._id == swipe.bookID
            )
          }
        );
      }

      res.json({
        mySwipeHistory: mySwipeHistory
      });
    });

    app.get('/api/myMatches', middleware.ensureAuthenticated, async (req, res) => {
      const MAX_DESC_LEN = 100;
      let currentUserID = req.session.passport.user;
      let currentUserObjectID = new ObjectId(req.session.passport.user);
      let myMatches = [];
    
      let allBooks = await Book.find();

      let allUsers = await User.find();

      let userMatches = await Match.find({
        $or: [
          { 'firstUser.userID': currentUserObjectID },
          { 'secondUser.userID': currentUserObjectID }
        ]
      });
      // console.log(userMatches);

      for (let match of userMatches) {
        let owner = (match.firstUser.userID == currentUserID ? match.secondUser : match.firstUser);
        let myself = (match.firstUser.userID == currentUserID ? match.firstUser : match.secondUser);

        // let myInfo = allUsers.find(user => user._id == currentUserID);
        let ownerInfo = allUsers.find(user =>
          user._id == owner.userID
        );

        let myBookInfo = allBooks.find(book =>
          book._id == owner.bookID
        );
        let hisBookInfo = allBooks.find(book =>
          book._id == myself.bookID
        );

        let existingOwner = myMatches.find( match =>
          match.ownerInfo._id == ownerInfo. _id
        );
        if (!existingOwner) {
          myMatches.push( {
            ownerInfo: ownerInfo,
            myBooks: [],
            hisBooks: []
          });

          existingOwner = myMatches[myMatches.length - 1];
        }

        let findMyBook = existingOwner.myBooks.find( book =>
          book._id == myBookInfo._id
        );
        if (!findMyBook) {
          existingOwner.myBooks.push(
            myBookInfo
          );
        }

        let findHisBook = existingOwner.hisBooks.find( book =>
          book._id == hisBookInfo._id
        );
        if (!findHisBook) {
          existingOwner.hisBooks.push(
            hisBookInfo
          );
        }
      }

      res.json({
        myMatches: myMatches
      });
    });

    app.post('/api/myProfile', middleware.ensureAuthenticated, async (req, res) => {
      const currUser = await User.findById(req.session.passport.user);

      const checkForExistingUsername = await User.findOne( 
        {
          username: req.body.username
        }
      );

      if (checkForExistingUsername) {
        res.json({
          error: errors.USERNAME_TAKEN
        });
        return;
      }

      console.log(req.body);
      currUser.username = req.body.username;
      currUser.bio = req.body.bio;
      currUser.fullName = {
        first: req.body.first,
        last: req.body.last
      };

      const saved = await currUser.save();
      
      console.log(`Updated user info for user ${currUser.username}`);
      res.json({
        currUser: currUser
      });
    });
};