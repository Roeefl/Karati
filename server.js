/* Requires */
const express = require('express');
const bodyParser= require('body-parser');
// const mongo = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const GoodReadsAPI = require('goodreads-api-node');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const errors = require('./config/errors');

require('dotenv').config();

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

/* Models */
const Models = require('./app/models/models');
let User = Models.User;
let Book = Models.Book;
let Match = Models.Match;

// Passport-Google
passport.use(new GoogleStrategy (
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne( { oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err); // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else { // user not found in users collection
        user = new User(
          {
            oauthID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            created: Date.now()
          }
        );
        user.save(function(err) {
          if(err) {
            console.log(err); // handle errors!
          } else {
            console.log('saving user to mongoose');
            done(null, user);
          }
        });
      }
    });
  }
));

// Passport-Google
passport.use(new FacebookStrategy (
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne( { oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err); // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else { // user not found in users collection
        user = new User(
          {
            oauthID: profile.id,
            name: profile.displayName,
            created: Date.now()
          }
        );
        user.save(function(err) {
          if(err) {
            console.log(err); // handle errors!
          } else {
            console.log('saving user to mongoose');
            done(null, user);
          }
        });
      }
    });
  }
));

// Configure Passport authenticated session persistence.
// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      if(!err) done(null, user);
      else done(err, null);
    });
});

let AUTH_GOODREADS = {
  'key'      : 'tww0u4mt3LF2cEYOwo88A',
  'secret'   :  'z5BfwtkdN7vCx2CGj6gqxJkrTz9Zv373xgCjdHnRY'
};
const goodreads = GoodReadsAPI(AUTH_GOODREADS);

// MongoDB
const COL_BOOKS = 'books';

// ExpressJS
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());  

// function ensureAuthenticated(req, res, next) {
//   console.log('ensureAuthenticated is used');

//   // if (req && req.session || !req.session.passport || !req.session.passport.user) {
//   if (!req.isAuthenticated()) {  
//     res.end( JSON.stringify( {
//         'error': errors.NOT_LOGGED_IN
//       } )
//     );
//     return;
//   }
//   return next();
// };


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }

    res.end( JSON.stringify( {
        'error': errors.NOT_LOGGED_IN
      } )
    );
};

const PORT = process.env.PORT || 9000;

// MongoDB Connect
mongoose.connect(process.env.ATLAS_CONNECTION, {useNewUrlParser: true} );
let db = mongoose.connection;
db.on('error', function () {
  console.log('connection error on mongoose')
});
db.once('open', function() {
    app.listen(PORT, () => {
      console.log('Listening on port ' + PORT);
    });
    console.log('Mongoose connected to MongoDB Atlas');
});

// function getBook(id, callback) {
//   collection.find({_id: mongo.ObjectID(id)}).toArray((err, result) => {
//     callback(result[0]);
//   });
// }

function handleError(err) {
  console.log('Error:');
  console.log(err);
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// app.post('/add-book', (req, res) => {
//   db.collection(COL_BOOKS).insertOne(req.body, (err, result) => {
//     if (err) return console.log(err);
//     console.log('saved to database');
//     res.end(JSON.stringify(result));
//   })
// });

// goodreads.getBooksByAuthor('656983');

app.post('/goodreads-search-books', (req, res) => {
  const FILTER_ALL = 'all';
  let query = req.body.query;

  goodreads.searchBooks( {q: query, field: FILTER_ALL} )
    .then( (result) => {
      res.end(JSON.stringify(result.search.results.work));
    }).catch( (error) => {
      console.log('Error from goodreads searchBooks API: ' + error);
    })
});

app.get('/book/:id', (req, res) => {
  console.log(req.params.id);
  Book.findOne({
    
  });
});

app.get('/login/google',
  passport.authenticate('google', { successRedirect: '/', scope:
    [ 'profile', 'email' ]
  })
);

app.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
);

app.get('/login/facebook',
  passport.authenticate('facebook', { successRedirect: '/', scope:
    [ 'profile' ]
  })
);
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/profile', ensureAuthenticated, function(req, res) {
  User.findById(req.session.passport.user, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.render('profile', { user: user} );
    }
  });
});

// if (!ensureLogin(req, res)) {
//   res.end( JSON.stringify(
//     {'error': errors.NOT_LOGGED_IN}
//   ));
//   return;
// }

// app.get('/books/:bookId', (req, res) => {
//   console.log(req.query);
//   db.collection(COL_BOOKS).find({_id: mongo.ObjectID(bookId)}).toArray((err, result) => {
//     res.end(JSON.stringify(result[0]));
//   });
// });

/**
 * Receives a goodreads book object and parses the author name
 * @param {*} book - Goodreads book object
 */
function parseAuthorName(book) {
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
};

/**
 * addOwnedBookByUser:
 * Attaches a current book in the DB to a current user record in the DB in the collection ownedbooks
 * @param {*} userID 
 * @param {*} bookID 
 * @param {*} res - response from post request
 */
function addOwnedBookByUser(userID, bookID, callback) {
  getUser(userID, foundUser => {
    let isBookOwnedByUser = false;
    if (foundUser.ownedBooks) {
      isBookOwnedByUser = foundUser.ownedBooks.find( book => book.bookID === bookID );
    }

    if (isBookOwnedByUser) {
      console.log('BookID ' + bookID + ' is already linked to UserID ' + userID);
      callback(false);
    } else {
      let newOwnedBook = {
        bookID: bookID,
        dateAdded: Date.now()
      };
      
      foundUser.ownedBooks.push(newOwnedBook);
      foundUser.save(function (err, saved) {  
        if (err) return handleError(err);
        console.log('addBookToUser saved book ' + bookID + ' to ' + userID);
        callback(true);
      });
    }
  });
};

/**
 * Adds book record to books collection if does not exist in it
 * @param {*} goodreadsID 
 * @param {*} callback 
 */
function addBookIfMissing(goodreadsID, callback) {
  Book.findOne( {
    goodreadsID: goodreadsID
  }, function (err, found) {
    if (err) return handleError(err);

    if (found) { // book already in books collection - just grab the objectID from it and callback
      console.log('bookObjectID exists: ' + found.id);
      callback(found.id);
    }
    else { // book not yet in Mongo collection books - so add it
      // console.log('Adding book to DB! ' + goodreadsID);
      goodreads.showBook(goodreadsID)
      .then( (result) => {

        // console.log(result);

        let saveBook = new Book(
          { goodreadsID: goodreadsID,
            author: parseAuthorName(result.book),
            title: result.book.title,
            created: Date.now(),
            imageURL: result.book.image_url,
            description: result.book.description,
            numOfPages: result.book.num_pages
          }
        );

        saveBook.save(function (err, saved) {
          if (err) return handleError(err);
        
          console.log('bookID saved:');
          console.log(saved);
          callback(saved.id);
        });
      }).catch( (error) => {
        console.log('Error from goodreads searchBooks API: ' + error);
      })
    }
  })
}

/**
 * Adds a book selected by user to mark as 'owned' to ownedBooks collection.
 * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
 */
app.post('/user-add-owned-book', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;
  
  addBookIfMissing(req.body.goodreadsID, bookID => {
    addOwnedBookByUser(currentUserID, bookID, saved => {
      res.end(JSON.stringify(
        {'saved': saved}
      ));
    });
  });
});

function getUser(userID, callback) {
  User.findOne(
    {
      _id: new ObjectId(userID)
    }, function( err, foundUser) {
      if (!foundUser) {
        console.log('FATAL ERROR on retrieving user ' + userID + ' from MongoDB.');
        return false;
      };

      callback(foundUser);
  });
}

/**
 * If a book exists in the OwnedBook collection, it means that some user has declared that he owns that book and put it up for exchange.
 * So basically all books in the OwnedBooks collection are good for display using the "user-next-swipe" post request.
 * However, there are 2 conditions under which a book will recurse:
 * 1 - If the userID in the OwnedBook record matches the userID of the current user - it's his own book and he shouldn't see it while swiping
 * 2 - If he already swept on it prior, he shouldn't see it either anymore.
 */
app.get('/user-get-swipes-batch', ensureAuthenticated, (req, res) => {
  const MAX_BATCH_SIZE = 30;

  let currentUserID = req.session.passport.user;
  let swipes = []; // init empty array for books available for swiping

  Book.find({}, function (err, allBooks) {
    getUser(currentUserID, currentUser => {
      User.
        find({}).
        where('_id').ne(currentUserID).
        limit(MAX_BATCH_SIZE).
        select('name ownedBooks').
        exec(function(err, usersWithPossibleBooksForSwiping) {
          for (let possibility of usersWithPossibleBooksForSwiping) {
            for (let ownedBook of possibility.ownedBooks) {

              let currBookID = ownedBook.bookID;
              let bookInfo = allBooks.find(book => book._id == currBookID);
              // console.log(allBooks);
              // console.log(currBookID);

              let isBookSwipedByCurrentUser = false;
              if (currentUser.swipes) {
                // console.log(currentUser.swipes.find( swipe => swipe.bookID == currBookID ));
                isBookSwipedByCurrentUser = currentUser.swipes.find( swipe => swipe.bookID == currBookID );
              }

              let isBookOwnedByCurrentUser = false;
              if (currentUser.ownedBooks) {
                isBookOwnedByCurrentUser = currentUser.ownedBooks.find( ownedBook => ownedBook.bookID == currBookID);
              }

              if (isBookSwipedByCurrentUser) {
                console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.name + ' already swiped it.');
              };
              if (isBookOwnedByCurrentUser) {
                console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.name + ' already owning it.');
              };

              // If not yet swiped by currentUser - push into available swipes
              if (!isBookSwipedByCurrentUser && !isBookOwnedByCurrentUser) {
                console.log('adding ' + currBookID + ' to swipes');
                let addSwipe = {
                  ownerID: possibility._id,
                  ownedBy: possibility.name,
                  bookID: currBookID,
                  author: bookInfo.author,
                  title: bookInfo.title,
                  imageURL: bookInfo.imageURL
                }
                
                console.log(swipes.length);
                swipes.push(addSwipe);
              }
              // console.log('pushed userID ' + possibility._id+ ' with bookID ' + ownedBook.bookID);
            }
          }

          if (swipes.length > 0) {
            res.end( JSON.stringify(swipes) );
          } else {
            res.end( JSON.stringify({'error': errors.END_OF_RESULTS}) );
          }
        });
    });
  });

  // TODO flatten-aggregation-group make this workz
  // User.aggregate([
  //   { $match: { _id: { $ne: userObjectID } } },
  //   { $group: { _id: null, books: { $mergeObjects: '$ownedBooks' } } },
  //   { $project: { _id: 0, books: true }}
  // ]).
  // then(function (res) {
  //   console.log(res[0].books); 
  // });
});

function alertUsersWithMail(user1, user2) {
  let msg = {
    to: user1.email,
    from: 'getkarati@gmail.com',
    subject: 'You have a new match in Karati!',
    text: 'Match',
    html: '<div>You have a new match in Karati!</div>'
  };
  sendGridMail.send(msg);

  msg.to = user2.email;
  sendGridMail.send(msg);
}

const STATUS_PENDING = 3;

/**
 * Check for ANY book match between two users
 * @param {*} currentUser 
 * @param {*} ownerID 
 */
function checkForMatch(currentUser, owner, swipedBookID, callback) {
  // so currently I already KNOW that currentUser has JUST swiped yes on some book that ownerID possesses.
  // now need to loop over the swipes array of ownerID and check if he has done a YES swipe on ANY book that currentUser has on his ownedBooks array
  if (owner.swipes) {
    for (let swipe of owner.swipes) {
      if (swipe.like) {
        let findMatch = currentUser.ownedBooks.find( ownedBook => ownedBook.bookID == swipe.bookID );
        
        if ( findMatch ) {

          let saveMatch = new Match({
            firstUser: {
              userID: currentUser._id,
              bookID: swipedBookID
            },
            secondUser: {
              userID: owner._id,
              bookID: swipe.bookID
            },
            dateMatched: Date.now(),
            status: STATUS_PENDING
          });

          saveMatch.save(function (err, saved) {
            if (err) return handleError(err);
          
            console.log('Match Saved:');
            console.log(saved);

            callback();
            return;
            // TODO: Mail alert both users with deep link to match when a new match
          });
        }
      }
    }
  }
}

app.post('/user-swipe-book', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;

  getUser(currentUserID, currentUser => {
    let newSwipe = {
      bookID: req.body.bookID,
      like: (req.body.like == 'true'),
      dateAdded: Date.now()
    };
      
    currentUser.swipes.push(newSwipe);
    currentUser.save(function (err, saved) {  
      if (err) return handleError(err);
      console.log('/user-swipe-book saved swipe ' + req.body.bookID + ' to user ' + currentUserID);

      if (newSwipe.like) {
        // if swipe was a YES - alert both users with a mail
        getUser(req.body.ownerID, owner => {
          checkForMatch(currentUser, owner, req.body.bookID, () => {
            alertUsersWithMail(currentUser, owner);
          });
        });
      }

      res.end(JSON.stringify(newSwipe));
    });
  });
});

app.get('/my-shelf', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;

  let myShelf = [];

  Book.find({}, (err, allBooks) => {
    if (err) return handleError(err);

    getUser(currentUserID, currentUser => {
      for (let ownedBook of currentUser.ownedBooks) { 
        let ownedBookID = ownedBook.bookID;
        let bookInfo = allBooks.find(book => book._id == ownedBookID);

        let addToShelf = {
          bookID: ownedBookID,
          author: bookInfo.author,
          title: bookInfo.title,
          goodreadsID: bookInfo.goodreadsID,
          imageURL: bookInfo.imageURL
        }

        myShelf.push(addToShelf);
      }

      if (myShelf.length > 0) {
        res.end( JSON.stringify(myShelf) );
      } else {
        res.end( JSON.stringify({'error': errors.SHELF_IS_EMPTY}) );
      }
    });
  });
});

const MAX_DESC_LEN = 200;

app.get('/user-get-matches', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;
  let currentUserObjectID = new ObjectId(req.session.passport.user);
  let returnMatches = [];
  
  Book.find({}, function (err, allBooks) { 

    User.find({}, function(err, allUsers) {

      Match.find({
        $or: [
          {'firstUser.userID'   : currentUserObjectID},
          {'secondUser.userID'  : currentUserObjectID}
        ]
      }, (err, userMatches) => {
        console.log(userMatches);

        for (let match of userMatches) {
          let owner = match.firstUser;
          let myself = match.secondUser;

          if (match.firstUser.userID == currentUserID) {
            owner = match.secondUser;
            myself = match.firstUser;
          }

          let myInfo = allUsers.find(user => user._id == currentUserID);
          let ownerInfo = allUsers.find(user => user._id == owner.userID);

          let myBookInfo = allBooks.find(book => book._id == myself.bookID);
          let otherBookInfo = allBooks.find(book => book._id == owner.bookID);

          let addToMatches = {
            myBook: {
              owner: myInfo.name,
              bookID: myself.bookID,
              author: myBookInfo.author,
              title: myBookInfo.title,
              goodreadsID: myBookInfo.goodreadsID,
              imageURL: myBookInfo.imageURL,
              desc: (myBookInfo.description ? myBookInfo.description.substr(0, MAX_DESC_LEN) : 0)
            },
            otherBook: {
              owner: ownerInfo.name,
              bookID: owner.bookID,
              author: otherBookInfo.author,
              title: otherBookInfo.title,
              goodreadsID: otherBookInfo.goodreadsID,
              imageURL: otherBookInfo.imageURL,
              desc: (otherBookInfo.description ? otherBookInfo.description.substr(0, MAX_DESC_LEN) : 0)
            },
            matchedOn: match.dateMatched,
            status: match.status
          };

          returnMatches.push(addToMatches);
        }
    
        if (returnMatches.length > 0) {
          res.end(
            JSON.stringify(returnMatches)
          );
        } else {
          res.end( JSON.stringify(
            {'error': errors.NO_MATCHES}
          ));
        }

      });

    });

  });
});

app.get('/user-match-chat', (req, res) => {

});

app.post('/user-match-chat-msg', (req, res) => {

});

app.post('/user-change-nickname', (req, res) => {

});

app.post('/user-change-settings', (req, res) => {

});

