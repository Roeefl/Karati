const express = require('express');
const bodyParser= require('body-parser');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const mongoose = require('mongoose');
require('./models/User');
require('./models/Book');
require('./models/Match');

/* Models */
const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const ObjectId = mongoose.Types.ObjectId;

const GoodReadsAPI = require('goodreads-api-node');

const matchStatus = require('./config/matchStatus');

require('dotenv').config();

const errors = require('./config/errors');

const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const AUTH_GOODREADS = {
  'key'      : 'tww0u4mt3LF2cEYOwo88A',
  'secret'   :  'z5BfwtkdN7vCx2CGj6gqxJkrTz9Zv373xgCjdHnRY'
};

const goodreads = GoodReadsAPI(AUTH_GOODREADS);


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
// app.use(express.static('client/build'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded(
  {
    extended: true
  }
));

app.use(
  expressSession(
    {
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
      }
    }
  )  
);

app.use(
  cookieParser()
);

const passportService = require('./services/passport');
passportService(app);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }

    res.end( JSON.stringify( {
        'error': errors.NOT_LOGGED_IN
      } )
    );
};

const PORT = process.env.PORT || 9000;

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

require('./routes/authRoutes')(app);

function handleError(err) {
  console.log('Error:');
  console.log(err);
}

app.get('/', (req, res) => {
  console.log('I AM APP GET / AND I RENDER INDEX WITH EJS');
  res.render('index', { user: req.user });
});

app.get('/error-codes', (req, res) => {
  res.end( JSON.stringify(errors) );
});
// goodreads.getBooksByAuthor('656983');
app.post('/api/books/search', async function searchGoodreads(req, res) {
  const FILTER_ALL = 'all';
  let query = req.body.query;

  let books = [];
  let goodreadsJson;

  try {
    goodreadsJson = await goodreads.searchBooks( {q: query, field: FILTER_ALL} );
  } catch(e) {
      res.end( JSON.stringify( { books: books } ) );
      return;
  }

  const searchResults = goodreadsJson.search.results.work;

  if ( !Array.isArray(searchResults) ) {
    books.push(response.data.best_book);
  } else {
      for (let result of searchResults) {
        books.push(result.best_book);
      }
  }
  res.end( JSON.stringify( { books: books } ) );
});

app.get('/api/books/:id', (req, res) => {
  console.log(req.params.id);
  Book.findOne({
    
  });
});

app.get('/api/myProfile', ensureAuthenticated, async (req, res) => {
  const currUser = await User.findById(req.session.passport.user);
  res.end( JSON.stringify( currUser ));
});

app.get('/api/currentUser', (req, res) => {
  res.send(req.user || false);
});

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
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
function addOwnedBookByUser(userID, bookID, goodreadsID, callback) {
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
        goodreadsID: goodreadsID,
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
  }, async function (err, found) {
    if (err) return handleError(err);

    if (found) { // book already in books collection - just grab the objectID from it and callback
      console.log('bookObjectID exists: ' + found.id);
      callback(found.id);
    }
    else { // book not yet in Mongo collection books - so add it
      // console.log('Adding book to DB! ' + goodreadsID);

      const result = await goodreads.showBook(goodreadsID)

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

      }).catch( (error) => {
        console.log('Error from goodreads searchBooks API: ' + error);
      })
    }
  });
};

app.get('/api/myBooks', ensureAuthenticated, (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) return handleError(err);

    let currentUserID = req.session.passport.user;

    getUser(currentUserID, currentUser => {
      let myBooks = [];

      for (let ownedBook of currentUser.ownedBooks) { 
        myBooks.push(
          allBooks.find(book => book._id == ownedBook.bookID)
        );
      }

      res.end( JSON.stringify(
        {
          myBooks: myBooks
        }
      ) );
      
    });
  });
});

/**
 * Adds a book selected by user to mark as 'owned' to ownedBooks collection.
 * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
 */
app.post('/api/myBooks/add', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;
  
  addBookIfMissing(req.body.goodreadsID, bookID => {
    addOwnedBookByUser(currentUserID, bookID, req.body.goodreadsID, saved => {
      res.end(JSON.stringify(
        { bookAddedToMyBooks: saved}
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
};

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
                console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.username + ' already swiped it.');
              };
              if (isBookOwnedByCurrentUser) {
                console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.username + ' already owning it.');
              };

              // If not yet swiped by currentUser - push into available swipes
              if (!isBookSwipedByCurrentUser && !isBookOwnedByCurrentUser) {
                console.log('adding ' + currBookID + ' to swipes');
                let addSwipe = {
                  ownerID: possibility._id,
                  ownedBy: possibility.username,
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
  // Freeze in Dev Mode to save SendGrid quota
  // sendGridMail.send(msg);

  msg.to = user2.email;
  // sendGridMail.send(msg);
}

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
            status: matchStatus.PENDING
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
              owner: myInfo.username,
              bookID: myself.bookID,
              author: myBookInfo.author,
              title: myBookInfo.title,
              goodreadsID: myBookInfo.goodreadsID,
              imageURL: myBookInfo.imageURL,
              desc: (myBookInfo.description ? myBookInfo.description.substr(0, MAX_DESC_LEN) : 0)
            },
            otherBook: {
              owner: ownerInfo.username,
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

