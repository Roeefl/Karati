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
const auth = require('./config/auth');
const atlas = require('./config/atlas');
const errors = require('./config/errors');

/* Models */
const Models = require('./app/models/models');
let User = Models.User;
let Book = Models.Book;
let Match = Models.Match;

// Passport-Google
passport.use(new GoogleStrategy (
  {
    clientID: auth.googleOAuth.clientID,
    clientSecret: auth.googleOAuth.clientSecret,
    callbackURL: auth.googleOAuth.callbackURL,
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
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret,
    callbackURL: auth.facebookAuth.callbackURL
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

const goodreads = GoodReadsAPI(auth.goodreads);

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

// MongoDB Connect
mongoose.connect(atlas.connection, {useNewUrlParser: true} );
let db = mongoose.connection;
db.on('error', function () {
  console.log('connection error on mongoose')
});
db.once('open', function() {
    app.listen(9000, () => {
      console.log('Listening on port 9000');
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

app.get('/books', (req, res) => {
  if (!ensureLogin(req, res)) return;

  Book.find({}, (err, books) => {
    if (err) return handleError(err);
      res.end(JSON.stringify(books));
  });
});

// goodreads.getBooksByAuthor('656983');

app.post('/goodreads-search-books', (req, res) => {
  if (!ensureLogin(req, res)) return;

  const FILTER_ALL = 'all';
  let query = req.body.query;

  goodreads.searchBooks( {q: query, field: FILTER_ALL} )
    .then( (result) => {
      res.end(JSON.stringify(result.search.results.work));
    }).catch( (error) => {
      console.log('Error from goodreads searchBooks API: ' + error);
    })
});

app.get('/login/google',
  passport.authenticate('google', { successRedirect: '/', scope:
    [ 'profile' ]
  })
);
app.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
);

app.get('/login/facebook',
  passport.authenticate('facebook'),
  function(req, res){});
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
};

function ensureLogin(req, res) {
  if (!req || !req.session || !req.session.passport || !req.session.passport.user) {
    res.end( JSON.stringify( {
        'error': errors.NOT_LOGGED_IN
      } )
    );
    return false;
  }
  return true;
};

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
      goodreads.showBook(goodreadsID)
      .then( (result) => {

        let saveBook = new Book(
          { goodreadsID: goodreadsID,
            author: parseAuthorName(result.book),
            title: result.book.title,
            created: Date.now(),
            imageURL: result.book.image_url
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
app.post('/user-add-owned-book', (req, res) => {
  if (!ensureLogin(req, res)) return;
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
app.get('/user-get-swipes-batch', (req, res) => {
  if (!ensureLogin(req, res)) return;

  let currentUserID = req.session.passport.user;
  let swipes = []; // init empty array for books available for swiping

  Book.find({}, function (err, allBooks) { 
    getUser(currentUserID, currentUser => {
      User.
        find({}).
        where('_id').ne(currentUserID).
        limit(10).
        select('name ownedBooks').
        exec(function(err, results) {
          for (let u = 0; u < results.length; u++) {
            for (let b = 0; b < results[u].ownedBooks.length; b++) {

              let currBookID = results[u].ownedBooks[b].bookID;
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
                  ownerID: results[u]._id,
                  ownedBy: results[u].name,
                  bookID: currBookID,
                  author: bookInfo.author,
                  title: bookInfo.title,
                  imageURL: bookInfo.imageURL
                }
                
                console.log(swipes.length);
                swipes.push(addSwipe);
              }
              // console.log('pushed userID ' + results[u]._id+ ' with bookID ' + results[u].ownedBooks[b].bookID);
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

  // User.aggregate([
  //   { $match: { _id: { $ne: userObjectID } } },
  //   { $group: { _id: null, books: { $mergeObjects: '$ownedBooks' } } },
  //   { $project: { _id: 0, books: true }}
  // ]).
  // then(function (res) {
  //   console.log(res[0].books); 
  // });
});

/**
 * Check for ANY book match between two users
 * @param {*} currentUser 
 * @param {*} ownerID 
 */
function checkForMatch(currentUser, ownerID) {
  // console.log('Checking for match between:');
  // console.log(firstUserID);
  // console.log(secondUserID);
  
  // so currently I already KNOW that currentUser has JUST swiped yes on some book that ownerID possesses.
  // now need to loop over the swipes array of ownerID and check if he has done a YES swipe on ANY book that currentUser has on his ownedBooks array
  getUser(ownerID, owner => {
    let hasSwipedYesOnAnyBookByTheOtherUser = false;
    if (owner.swipes) {
      for (let s = 0; s < owner.swipes.length; s++) {
        if (owner.swipes[s].like) {
          let findMatch = currentUser.ownedBooks.find( ownedBook => ownedBook.bookID ==  owner.swipes[s].bookID );ג
          if ( findMatch ) {
            console.log('MATCH!');
            console.log(findMatch); 
          }ג
        }
      }
    }
  });
}

app.post('/user-swipe-book', (req, res) => {
  if (!ensureLogin(req, res)) return;

  let currentUserID = req.session.passport.user;

  getUser(currentUserID, currentUser => {
    let newSwipe = {
      bookID: req.body.bookID,
      like: req.body.like,
      dateAdded: Date.now()
    };
      
    currentUser.swipes.push(newSwipe);
    currentUser.save(function (err, saved) {  
      if (err) return handleError(err);
      console.log('/user-swipe-book saved swipe ' + req.body.bookID + ' to user ' + currentUserID);

      if (req.body.like) {
        // if swipe was a YES
        checkForMatch(currentUser, req.body.ownerID);
      }
      
      res.end(JSON.stringify(newSwipe));
    });
  });
});

app.get('/user-book-info', (req, res) => {
  
});

app.get('/user-matches', (req, res) => {

});

app.get('/user-match-chat', (req, res) => {

});

app.post('/user-match-chat-msg', (req, res) => {

});

app.post('/user-change-nickname', (req, res) => {

});

app.post('/user-change-settings', (req, res) => {

});

