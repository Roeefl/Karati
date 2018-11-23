/* Requires */
const express = require('express');
const bodyParser= require('body-parser');
// const mongo = require('mongodb');
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const GoodReadsAPI = require('goodreads-api-node');
const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const auth = require('./config/auth');
const atlas = require('./config/atlas');
// const ensureLogin = require('connect-ensure-login');

/* Models */
const Models = require('./app/models/models');
let User = Models.User;
let Book = Models.Book;
let OwnedBook = Models.OwnedBook;
let Swipe = Models.Swipe;

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
  Book.find({}, (err, books) => {
    if (err) return handleError(err);
      res.end(JSON.stringify(books));
  });
});

// goodreads.getBooksByAuthor('656983');

app.post('/goodreads-search-books', (req, res) => {
  // req.body.query === query from UI
  const FILTER_ALL = 'all';
  let query = req.body.query;

  goodreads.searchBooks( {q: query, field: FILTER_ALL} )
    .then( (result) => {
      res.end(JSON.stringify(result.search.results.work));
    }).catch( (error) => {
      console.log('Error from goodreads searchBooks API: ' + error);
    })
});

// Passport GET
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

app.get('/profile',
  ensureAuthenticated, function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
      if(err) {
        console.log(err);
      } else {
        res.render('profile', { user: user} );
      }
    });
  }
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

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
 * Attaches a current book in the DB to a current user record in the DB in the collection ownedbooks
 * @param {*} userID 
 * @param {*} bookObjectID 
 * @param {*} res - response from post request
 */
function addBookToUser(loggedInUserID, bookObjectID, res) {
  OwnedBook.findOne( {userID: loggedInUserID, bookID: bookObjectID}, function (err, found ) {
    // if found already - dont do shit - just notify
    if (found) {
      console.log('Book ' + bookObjectID + ' is already linked to User ' + loggedInUser.name);
      res.end( JSON.stringify({'saved': false}) );
    } else {

      let savedOwnedBook = new OwnedBook(
        { userID: loggedInUserID,
          bookID: bookObjectID
        }
      );
      
      savedOwnedBook.save(function(err, saved) {
        if (err) return handleError(err);
        console.log('addBookToUser saved: ' + saved.userID + ' & ' + saved.bookID);
        res.end( JSON.stringify({'saved': true}) );
      });

    }
  });
};

/**
 * Adds a book selected by user to mark as 'owned' to ownedBooks collection.
 * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
 */
  app.post('/user-add-owned-book', (req, res) => {
  let userID = req.session.passport.user;

  Book.findOne({goodreadsID: req.body.goodreadsID}, function (err, book) {
    if (err) return handleError(err);

    // book not yet in DB - then add it to DB first, then attach
    if (!book) {
      goodreads.showBook(req.body.goodreadsID)
      .then( (result) => {

        let saveBook = new Book(
          { goodreadsID: req.body.goodreadsID,
            author: parseAuthorName(result.book),
            title: result.book.title,
            created: Date.now(),
            imageURL: result.book.image_url
          }
        );

        saveBook.save(function (err, savedBook) {
          if (err) return handleError(err);
        
          console.log('bookObjectID saved: ' + savedBook.id);
          addBookToUser(userID, savedBook.id, res);
        });

      }).catch( (error) => {
        console.log('Error from goodreads searchBooks API: ' + error);
      })
    } else {
      // if book already in DB - just grab the objectID from it and attach
      console.log('bookObjectID exists: ' + book.id);
      addBookToUser(userID, book.id, res);
    }
  });
});

/**
 * Recursively find the next book for swipe
 * @param {*} loggedInUserID - UserID of active user
 * @param {*} ownedBooksArr - Array containing all possible results from ownedBooks collection in Mongo
 * @param {*} currBook - Index of current book the recursion  is iterating through in the ownedBooksArr
 * @returns {*} Ideally calls the callback function with the next possible book to view while swiping for the active user, or error if no more books for him
 */
function findNextBookForSwipe(loggedInUserID, ownedBooksArr, currBook, callback) {
  /* Stopping Condition */
  if (currBook >= ownedBooksArr.length) {
    console.log('findNextBookForSwipe reached stopping');
    callback( {'error': 99} );
    return;
  }

  /* If userID of book === userID of current user, dont show it on swiping, so ask for next book */
  if (ownedBooksArr[currBook].userID === loggedInUserID) {
    console.log('findNextBookForSwipe found book of current loggedInUserID: ' + loggedInUserID);
    return findNextBookForSwipe(loggedInUserID, ownedBooksArr, ++currBook, callback);
  }

  /* Got here - so found a book of another user - check if already swiped */
  Swipe.findOne(
    {
      userID: loggedInUserID,
      bookID: ownedBooksArr[currBook].bookID
    }, function(err, found) {

      if (found) {
        /* Current book already been swiped by current user */
        console.log('findNextBookForSwipe found existing swipe with booKID ' + found.bookID + ' and userID ' + found.userID);
        return findNextBookForSwipe(loggedInUserID, ownedBooksArr, ++currBook, callback);
      } else {
        console.log('findNextBookForSwipe found available book for swiping: ' + ownedBooksArr[currBook].bookID);

        Book.findOne( { _id: new ObjectId(ownedBooksArr[currBook].bookID) }, function (err, bookInfo) {
          if (err) return handleError(err);

          User.findOne({ _id: new ObjectId(ownedBooksArr[currBook].userID) }, function (err, usr) {
            if (err) return handleError(err);

            let result = {
              bookID: ownedBooksArr[currBook].bookID,
              ownedBy: usr.name,
              author: bookInfo.author,
              title: bookInfo.title,
              imageURL: bookInfo.imageURL
            };

            callback(result);
            return;
          });
        });

      }
    }
  );
}

/**
 * If a book exists in the OwnedBook collection, it means that some user has declared that he owns that book and put it up for exchange.
 * So basically all books in the OwnedBooks collection are good for display using the "user-next-book" post request.
 * However, there are 2 conditions under which a book will recurse:
 * 1 - If the userID in the OwnedBook record matches the userID of the current user - it's his own book and he shouldn't see it while swiping
 * 2 - If he already swept on it prior, he shouldn't see it either anymore.
 */
app.get('/user-next-book', (req, res) => {
  if (!req.session.passport) {
    console.log('not connected');
    res.end();
    return;
  }

  OwnedBook.find({  }, function (err, ownedBooksArr) {
    if (err) return handleError(err);
    
    findNextBookForSwipe(req.session.passport.user, ownedBooksArr, 0, result => {
      res.end( JSON.stringify(result) );
    });
  });
});

app.post('/user-swipe-book', (req, res) => {

  let saveSwipe = new Swipe(
    { when: Date.now(),
      userID: req.session.passport.user,
      bookID: req.body.bookID,
      like: req.body.like
    }
  );

  saveSwipe.save(function (err, saved) {
    if (err) return handleError(err);
    console.log('Swipe saved: ' + saved.id);
    res.end(JSON.stringify(saved));
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

