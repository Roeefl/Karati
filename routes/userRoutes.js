const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const middleware = require('../common/middleware');

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const matchStatus = require('../config/matchStatus');
const errors = require('../config/errors');

module.exports = (app) => {
  
    app.get('/api/myProfile', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const currUser = await User.findById(req.currentUser._id);
      res.json( middleware.reverseNotifications(currUser) );
    });

    app.get('/api/mySwipeHistory', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      let bookData = await Book.findInIdArray( req.currentUser.swipes.map(swipe => swipe.bookID) );
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

      res.json({ mySwipeHistory });
    });

    pushProposal = async (proposals, proposal, owner, proposedByMe, myBook, hisBook) => {
      const proposalObj = await middleware.createProposalObj(proposal, owner, proposedByMe, myBook, hisBook);
      proposals.push(proposalObj);
    };

    pushToMatchesObj = (myMatches, match, ownerInfo, myBookInfo, hisBookInfo) => {
      let existingOwner = myMatches.find( match =>
        match.ownerInfo._id == ownerInfo._id
      );

      if (existingOwner) {
        // existingOwner already found and pushed - only check for proposal in progress prop
        if (match.status === matchStatus.PROPOSED || match.status === matchStatus.ACCEPTED) {
          existingOwner.proposalInProgress = true;
        }
      } else {
        myMatches.push( {
          ownerInfo,
          myBooks: [],
          hisBooks: [],
          proposalInProgress: (match.status === matchStatus.PROPOSED || match.status === matchStatus.ACCEPTED)
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

        if ( match.status === matchStatus.PROPOSED || match.status === matchStatus.ACCEPTED ) {
          existingOwner.proposalInProgress = true
        } 
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

    findMatchesForUser = async (currUserId, activeProposalsOnly) => {
      let currentUserObjectID = new ObjectId(currUserId);
      let allUsers = await User.find();
      let myMatches = [];

      let userMatches = null;
      if (activeProposalsOnly)
        userMatches = await Match.findActiveByUserID(currentUserObjectID);
      else
        userMatches = await Match.findByUserID(currentUserObjectID);

      if (!userMatches)
        res.json({ error: (activeProposalsOnly ? errors.NO_PROPOSALS : errors.NO_MATCHES) });

      const allBookIDS = userMatches.map( match => match.firstUser.bookID ).concat( userMatches.map( match => match.secondUser.bookID ) );
      const allBooks = await Book.findInIdArray(allBookIDS);

      for (let match of userMatches) {
        let owner = (match.firstUser.userID == currUserId ? match.secondUser : match.firstUser);
        let myself = (match.firstUser.userID == currUserId ? match.firstUser : match.secondUser);

        let ownerInfo = allUsers.find( user => 
          user._id == owner.userID
        );

        let myBookInfo = allBooks.find(book =>
          book._id == owner.bookID
        );
        let hisBookInfo = allBooks.find(book =>
          book._id == myself.bookID
        );

        if (activeProposalsOnly) {
          await pushProposal(myMatches, match, ownerInfo.username, myself.proposed, myBookInfo.title, hisBookInfo.title);
        } else {
          pushToMatchesObj(myMatches, match, ownerInfo, myBookInfo, hisBookInfo);
        }
      }

      return myMatches;
    }

    app.get('/api/myProposals', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const myProposals = await findMatchesForUser(req.currentUser._id, true);
      res.json({ myProposals });
    });

    app.get('/api/myMatches', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const myMatches = await findMatchesForUser(req.currentUser._id, false);
      res.json({ myMatches });
    });

    app.post('/api/myProfile', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const currUser = await User.findById(req.currentUser._id);
      const { username, bio, first, last } = req.body;

      if (username != currUser.username) {
        // User is asking to change his username
        const checkForExistingUsername = await User.findOne({ username });

        if (checkForExistingUsername) {
          res.json({
            error: errors.USERNAME_TAKEN
          });
          return;
        }
      }

      currUser.username = username;
      currUser.bio = bio;
      currUser.fullName = {
        first,
        last
      };

      await currUser.save();
      console.log(`Updated user info for user ${currUser.username}`);
      res.json({
        currUser: middleware.reverseNotifications(currUser)
      });
    });

    app.post('/api/mySettings', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const currUser = await User.findById(req.currentUser._id);

      currUser.settings = req.body.settings;
      await currUser.save();
      console.log(`Updated settings for user ${currUser.username}`);
      
      res.json({
        currUser: middleware.reverseNotifications(currUser)
      });
    });

    app.put('/api/user/:userId/notification/:id/seen', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const currUser = await User.findById(req.currentUser._id);

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

    app.put('/api/user/:userId/notification/clear', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
      const currUser = await User.findById(req.currentUser._id);

      if (!currUser.notifications) {
        res.json({
          currUser: middleware.reverseNotifications(currUser)
        });
        return;
      }

      for (let notif of currUser.notifications) {
        notif.seen = true;
      }

      await currUser.save();
      console.log(`Updated notification ${req.params.id} for user ${currUser.username}`);
      
      res.json({
        currUser: middleware.reverseNotifications(currUser)
      });
    });
    
};