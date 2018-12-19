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

const errors = require('./config/errors');

const goodreads = GoodReadsAPI(Goodreads_KEY);

const app = express();

const middleware = require('./common/middleware');

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

app.get('/api/myProfile', middleware.ensureAuthenticated, async (req, res) => {
  const currUser = await User.findById(req.session.passport.user);
  res.end( JSON.stringify( currUser ));
});

app.get('/api/myShelf', middleware.ensureAuthenticated, (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) return handleError(err);

    middleware.getUser(req.session.passport.user)
      .then(currentUser => {
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
      })
      .catch(error => {
        console.log(error);
      });
      
  });
});

/**
 * Adds a book selected by user to mark as 'owned' to ownedBooks collection.
 * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
 */
app.post('/api/myShelf', middleware.ensureAuthenticated, async (req, res) => {
  let currentUserID = req.session.passport.user;
  
  let bookID = await addOrUpdateTimeStampForBook(req.body.goodreadsID);

  let saved = await addOwnedBookByUser(currentUserID, bookID, req.body.goodreadsID);

  res.end(JSON.stringify(
    { bookAddedToMyShelf: saved}
  ));

});

/**
 * Adds book record to books collection if does not exist in it
 * @param {*} goodreadsID 
 */
addOrUpdateTimeStampForBook = (goodreadsID) => {
  return new Promise( (resolve, reject) => {

      Book.findOne( {
        goodreadsID: goodreadsID
      }, async function (err, existingBook) {
        if (err) {
          reject(err);
          return;
        }

        if (existingBook) {
          console.log('updating timeStamp for book: ' + existingBook.id);
          existingBook.lastMarkedAsOwned = Date.now();
          await existingBook.save();

          resolve(existingBook.id);
          return;
        }

        // book not yet in Mongo collection books - so add it
        console.log('Adding book to MongoDB /books: ' + goodreadsID);

        const result = await goodreads.showBook(goodreadsID);

        // console.log(result.book);
        // console.log(result.book.popular_shelves.shelf);

        let bookData = middleware.parseBookDataObjFromGoodreads(goodreadsID, result);
        const saved = await bookData.save();

        console.log('Book added succesfully to MongoDB /books: ' + saved.id);
        resolve(saved.id);
      });

    });
};

/**
 * Attaches a current book in the DB to a current user record in the DB in the collection ownedbooks
 * @param {*} userID 
 * @param {*} bookID 
 * @param {*} goodreadsID
 */
addOwnedBookByUser = (userID, bookID, goodreadsID) => {
  return new Promise( (resolve, reject) => {
    middleware.getUser(userID)
      .then(foundUser => {
        let isBookOwnedByUser = false;
        if (foundUser.ownedBooks) {
          isBookOwnedByUser = foundUser.ownedBooks.find( book => book.bookID === bookID );
        }
    
        if (isBookOwnedByUser) {
  
          console.log('BookID ' + bookID + ' is already linked to UserID ' + userID);
          resolve(false);
          return;
  
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
            if (err) {
              reject(err);
              return;
            }
  
            console.log('addBookToUser saved book ' + bookID + ' to ' + userID);
            resolve(true);
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
};

app.get('/api/myMatches', middleware.ensureAuthenticated, (req, res) => {
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
