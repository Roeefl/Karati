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
const Goodreads_KEY = require('./config/goodreads');

require('dotenv').config();

const matchStatus = require('./config/matchStatus');
const errors = require('./config/errors');

const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const goodreads = GoodReadsAPI(Goodreads_KEY);

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

// const ensureAuthenticated = require ('./services/ensureAuthenticated');
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  
  res.end( JSON.stringify( {
      'error': errors.NOT_LOGGED_IN
  } )
  );
};

require('./routes/authRoutes')(app);
require('./routes/bookRoutes')(app);

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

app.get('/api/myProfile', ensureAuthenticated, async (req, res) => {
  const currUser = await User.findById(req.session.passport.user);
  res.end( JSON.stringify( currUser ));
});

app.get('/api/myShelf', ensureAuthenticated, (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) return handleError(err);

    let currentUserID = req.session.passport.user;

    getUser(currentUserID, currentUser => {
      let myShelf = [];

      for (let ownedBook of currentUser.ownedBooks) { 
        myShelf.push(
          allBooks.find(book => book._id == ownedBook.bookID)
        );
      }

      res.end( JSON.stringify(
        {
          myShelf: myShelf
        }
      ) );
      
    });
  });
});

/**
 * Adds a book selected by user to mark as 'owned' to ownedBooks collection.
 * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
 */
app.post('/api/myShelf', ensureAuthenticated, (req, res) => {
  let currentUserID = req.session.passport.user;
  
  addOrUpdateTimeStampForBook(req.body.goodreadsID, bookID => {
    addOwnedBookByUser(currentUserID, bookID, req.body.goodreadsID, saved => {
      res.end(JSON.stringify(
        { bookAddedToMyShelf: saved}
      ));
    });
  });
});

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

      if (!foundUser.passedIntro && foundUser.ownedBooks.length >= 5) {
        foundUser.passedIntro = true;
      }

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
function addOrUpdateTimeStampForBook(goodreadsID, callback) {
  Book.findOne( {
    goodreadsID: goodreadsID
  }, async function (err, existingBook) {
    if (err) return handleError(err);

    if (existingBook) { // book already in books collection - just grab the objectID from it and callback
      console.log('updating timeStamp for book: ' + existingBook.id);

      existingBook.lastMarkedAsOwned = Date.now();
      await existingBook.save();

      callback(existingBook.id);
    }
    else { // book not yet in Mongo collection books - so add it
      // console.log('Adding book to DB! ' + goodreadsID);

      const result = await goodreads.showBook(goodreadsID)

      let saveBook = new Book(
        { goodreadsID: goodreadsID,
          author: parseAuthorName(result.book),
          title: result.book.title,
          createdAt: Date.now(),
          lastMarkedAsOwned: Date.now(),
          imageURL: result.book.image_url,
          description: result.book.description,
          numOfPages: result.book.num_pages
        }
      );

      const saved = await saveBook.save();
      
      console.log('saved: ' + saved);
      callback(saved.id);
    }
  });
};

app.get('/api/myMatches', ensureAuthenticated, (req, res) => {
  const MAX_DESC_LEN = 100;
  let currentUserID = req.session.passport.user;
  let currentUserObjectID = new ObjectId(req.session.passport.user);
  let myMatches = [];

  Book.find({}, function (err, allBooks) {

    User.find({}, function (err, allUsers) {

      Match.find({
        $or: [
          { 'firstUser.userID': currentUserObjectID },
          { 'secondUser.userID': currentUserObjectID }
        ]
      }, (err, userMatches) => {
        console.log(userMatches);

        for (let match of userMatches) {
          let owner = (match.firstUser.userID == currentUserID ? match.secondUser : match.firstUser);
          let myself = (match.firstUser.userID == currentUserID ? match.firstUser : match.secondUser);

          let myInfo = allUsers.find(user => user._id == currentUserID);
          let ownerInfo = allUsers.find(user => user._id == owner.userID);

          let myBookInfo = allBooks.find(book => book._id == owner.bookID);
          let otherBookInfo = allBooks.find(book => book._id == myself.bookID);

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
            status: match.status,
            id: match._id
          };

          myMatches.push(addToMatches);
        }

        if (myMatches.length > 0) {
          res.end(
            JSON.stringify(
              {
                myMatches: myMatches
              }
            )
          );
        } else {
          res.end(JSON.stringify(
            { 'error': errors.NO_MATCHES }
          ));
        }

      });

    });

  });
});
