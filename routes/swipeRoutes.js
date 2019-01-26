const mongoose = require('mongoose');
const middleware = require('../common/middleware');
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const Mailer = require('../services/Mailer');
const matchStatus = require('../config/matchStatus');
const newMatchTemplate = require('../services/emailTemplates/newMatch');

/**
 * Check for ANY book match between two users
 * @param {*} currentUser 
 * @param {*} ownerID 
 */
checkForMatch = (currentUser, owner, swipedBookID) => {
    // so currently I already KNOW that currentUser has JUST swiped yes on some book that ownerID possesses.
    // now need to loop over the swipes array of ownerID and check if he has done a YES swipe on ANY book that currentUser has on his ownedBooks array
    return new Promise((resolve, reject) => {

        if (!owner.swipes) {
            resolve(false);
            return;
        };

        for (let swipe of owner.swipes) {
            if (swipe.like) {
                let findMatch = currentUser.ownedBooks.find(ownedBook =>
                    ownedBook.bookID == swipe.bookID
                );

                if (findMatch) {

                    let pushMatch = new Match({
                        firstUser: {
                            userID: currentUser._id,
                            bookID: swipedBookID,
                            proposed: false
                        },
                        secondUser: {
                            userID: owner._id,
                            bookID: swipe.bookID,
                            proposed: false
                        },
                        dateMatched: Date.now(),
                        status: matchStatus.PENDING,
                        lastStatusDate: Date.now(),
                        chat: []
                    });

                    pushMatch.save(function (err, saved) {
                        if (err) {
                            reject(err);
                            return;
                        };

                        console.log('Match Saved between ' + currentUser.username + ' and ' + owner.username);
                        resolve(pushMatch);
                    });
                }
            }
        }
    });
};

addNotificationToUser = (user, matchWith) => {
    return new Promise((resolve, reject) => {
        let notification = {
            content: `You have new matches with ${matchWith.username}`,
            dateCreated: Date.now(),
            seen: false,
            link: `/myMatches/${matchWith._id}`
        };

        user.notifications.push(notification);

        user.save(function (err, saved) {
            if (err) {
                reject(err);
                return;
            };

            console.log(`Saved new notification for user ${user.username}`);
            resolve(true);
        });
    });
};

checkForMatchWrapper = async (user1, user2, lastSwipedBookID) => {
    let match = await checkForMatch(user1, user2, lastSwipedBookID);
    if (!match)
        return;

    // This is where send mail to both users
    let mailer = new Mailer('New Match in Karati', [user1], newMatchTemplate(match, user2._id));
    mailer.send();
    mailer = new Mailer('New Match in Karati', [user2], newMatchTemplate(match, user1._id));
    mailer.send();

    await addNotificationToUser( user1, user2 );
    await addNotificationToUser( user2, user1 ); 
};

addSwipeToUser = (user, bookID, liked) => {
    return new Promise((resolve, reject) => {
        let newSwipe = {
            bookID: bookID,
            like: liked,
            dateAdded: Date.now()
        };

        user.swipes.push(newSwipe);
        user.save(function (err, saved) {
            if (err) {
                reject(err);
                return;
            };

            console.log('Saved swipe [' + liked + '] for book ' + bookID + ' for user ' + user.username);
            resolve(true);
        });
    });
};

addLikeToBook = (bookID) => {
    return new Promise((resolve, reject) => {
        Book.updateOne(
            {
                _id: new ObjectId(bookID)
            },
            {
                $inc: {
                    "likes" : 1
                }
            },
            {
                upsert: true
            }
        )
            .then( (updated) => {
                console.log('incremented likes for book ' + bookID);
                resolve(true);
            })
            .catch( err => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = (app) => {

    app.put('/api/swipe/liked', middleware.ensureAuthenticated, async (req, res) => {
        const { myUserID, ownerID, bookID } = req.body;

        let firstUser = await User.findById( myUserID );
        let owner = await User.findById( ownerID );

        let added = await addSwipeToUser( firstUser, bookID, true );
        await addLikeToBook( bookID );

        res.json({ swipeAdded: added });

        checkForMatchWrapper( firstUser, owner, bookID );
    });

    app.put('/api/swipe/rejected', middleware.ensureAuthenticated, async (req, res) => {
        const { myUserID, bookID } = req.body;

        let firstUser = await User.findById( myUserID );

        let added = await addSwipeToUser( firstUser, bookID, false );

        res.json({ swipeAdded: added });
    });

}