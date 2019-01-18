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

      res.end( JSON.stringify( middleware.reverseNotifications(currUser) ));
    });

    app.get('/api/mySwipeHistory', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {

      let bookData = await Book.find(
        {
            "_id": {
                "$in": 
                    req.currentUser.swipes.map( swipe => swipe.bookID )
            }
        }
      );

      let mySwipeHistory = [];

      for (let s = req.currentUser.swipes.length - 1; s >= 0; s--) { 
        let swipe = req.currentUser.swipes[s];
        
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

      let userMatches = await Match.find({
        $or: [
          { 'firstUser.userID': currentUserObjectID },
          { 'secondUser.userID': currentUserObjectID }
        ]
      });

      const allBookIDS = userMatches.map( match => match.firstUser.bookID ).concat( userMatches.map( match => match.secondUser.bookID ) );

      // console.log(allBookIDS);

      let allBooks = await Book.find(
        {
            "_id": {
                "$in": 
                  allBookIDS
            }
        }
      );

      let allUsers = await User.find();

      for (let match of userMatches) {
        let owner = (match.firstUser.userID == currentUserID ? match.secondUser : match.firstUser);
        let myself = (match.firstUser.userID == currentUserID ? match.firstUser : match.secondUser);

        let ownerInfo = allUsers.find( user => 
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
        currUser: middleware.reverseNotifications(currUser)
      });
    });

    app.post('/api/mySettings', middleware.ensureAuthenticated, async (req, res) => {
      const currUser = await User.findById(req.session.passport.user);

      console.log(req.body);

      currUser.settings = req.body.settings;

      await currUser.save();
      
      console.log(`Updated settings for user ${currUser.username}`);
      
      res.json({
        currUser: middleware.reverseNotifications(currUser)
      });
    });

    app.put('/api/user/:userId/notification/:id/seen', middleware.ensureAuthenticated, async (req, res) => {
      const currUser = await User.findById(req.session.passport.user);

      let currentNotification = currUser.notifications.find( notif => 
        notif._id == req.params.id  
      );

      if (!currentNotification) {
        res.json({
          currUser: middleware.reverseNotifications(currUser)
        });
        return;
      }

      currentNotification.seen = true;

      await currUser.save();
      
      console.log(`Updated notification ${req.params.id} for user ${currUser.username}`);
      
      res.json({
        currUser: middleware.reverseNotifications(currUser)
      });
    });
};