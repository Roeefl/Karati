const mongoose = require('mongoose');
const errors = require('../config/errors');
const middleware = require('../common/middleware');

const genreList = require('../common/genres');

const User = mongoose.model('users');
const Book = mongoose.model('books');
// const Match = mongoose.model('matches');

const FILTER_ALL = 'all';
const FEED_MAX_BOOKS = 10;
const SWIPE_MAX_BOOKS = 30;

const geolib = require('geolib');
const distance = require('../config/distance');

addCommentToBook = (book, userID, comment) => {
  return new Promise( (resolve, reject) => {

    let newComment = {
      userID,
      content: comment,
      dateAdded: Date.now()
    };

    if (!book.comments)
      book.comments = [];

    book.comments.push(newComment);

    book.save(function (err, saved) {  
      if (err) {
        reject(err);
        return;
      };

      console.log('Saved comment for book ' + book.title + ' : ' + newComment.content);
      resolve(true);
    });
  });
};

module.exports = (app, goodreads) => {

  app.get('/api/genres', async (req, res) => {
    res.json({ genres: genreList.list });
  });

  /**
   * If a book exists in the OwnedBook collection, it means that some user has declared that he owns that book and put it up for exchange.
   * So basically all books in the OwnedBooks collection are good for display using the "user-next-swipe" post request.
   * However, there are 2 conditions under which a book will recurse:
   * 1 - If the userID in the OwnedBook record matches the userID of the current user - it's his own book and he shouldn't see it while swiping
   * 2 - If he already swept on it prior, he shouldn't see it either anymore.
   */
  // List all books available to swipe for user
  app.get('/api/availableSwipes', middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
    let availableSwipes = []; // init empty array for books available for swiping
    const allBooks = await Book.find();

    // let rndUser = await User.fetchRandom();

    User.
      find().
      where('_id').ne(req.currentUser._id).
      select('username location ownedBooks').
      exec(function (err, usersWithPossibleBooksForSwiping) {
        for (let possibility of usersWithPossibleBooksForSwiping) {

          const myLocation = { latitude: req.currentUser.location.lat , longitude: req.currentUser.location.lng };
          // const hisLocation = {	latitude: 32.109333, longitude: 34.855499 }; // Tel Aviv
          const hisLocation = { latitude: possibility.location.lat , longitude: possibility.location.lng };
          // console.log(myLocation);
          // console.log(hisLocation);

          const dist = geolib.getDistance(
            myLocation, hisLocation
          );   
          console.log(`distance: ${dist}, max distance: ${distance.MAX_DISTANCE}`);

          if (dist > distance.MAX_DISTANCE)
            continue;

          for (let ownedBook of possibility.ownedBooks) {

            if (!ownedBook.available)
              continue;

            const { bookID } = ownedBook;
            let bookInfo = allBooks.find( book =>
              book._id == bookID
            );
            if (!bookInfo)
              continue;

            let isBookSwipedByCurrentUser = false;
            if (req.currentUser.swipes) {
              isBookSwipedByCurrentUser = req.currentUser.swipes.find(swipe =>
                swipe.bookID == bookID
              );
            }
            if (isBookSwipedByCurrentUser)
              continue;

            let isBookOwnedByCurrentUser = false;
            if (req.currentUser.ownedBooks) {
              isBookOwnedByCurrentUser = req.currentUser.ownedBooks.find(ownedBook =>
                ownedBook.bookID == bookID
              );
            }
            if (isBookOwnedByCurrentUser)
              continue;

            // If not yet swiped by currentUser - push into available swipes
            const { author, title, imageURL, numOfPages, description, publicationYear, averageRating, genres, comments } = bookInfo;
            let addSwipe = {
              ownerID: possibility._id,
              ownedBy: possibility.username,
              bookID,
              author,
              title,
              imageURL,
              desc: description,
              numOfPages,
              publicationYear,
              averageRating,
              genres,
              comments
            }

            if (availableSwipes.length >= SWIPE_MAX_BOOKS) {
              res.json({ availableSwipes: middleware.shuffleArray(availableSwipes) });
              return;
            }

            // console.log("adding swipe");
            // console.log(addSwipe);
            availableSwipes.push(addSwipe);
          }
            // console.log('pushed userID ' + possibility._id+ ' with bookID ' + ownedBook.bookID);
        }

        // console.log('******************* availableSwipes');
        res.json({ availableSwipes: middleware.shuffleArray(availableSwipes) });
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

  // Get one particular book that a user can swipe on
  app.get('/api/books/:id', async (req, res) => {
    // console.log(req.params.id);

    const foundBook = await Book.findById(req.params.id);

    if (!foundBook) {
      console.log('ERROR on retrieving book ' + req.params.id + ' from MongoDB');
      res.json({ 'error': errors.NO_BOOK });
      return false;
    };

    for (let comment of foundBook.comments) {
      const userInfo = await User.findById( comment.userID );
      comment.username = (userInfo ? userInfo.username : 'User Not Found');
    }

    res.json({ book: foundBook });
  });
    
  app.post('/api/books/search', async function searchGoodreads(req, res) {
    const { query, limit } = req.body;
    let books = [];

    try {
      const goodreadsJson = await goodreads.searchBooks( {q: query, field: FILTER_ALL} );
      const searchResults = goodreadsJson.search.results.work;

      if ( !Array.isArray(searchResults) ) {
        books.push(response.data.best_book);
      } else {
          for (let r = 0; r < Math.min(limit, searchResults.length); r++) {
            books.push(searchResults[r].best_book);
          }
      }
      res.json({ books });
    } catch(e) {
        res.json({ books });
    }
  });
  
  app.post('/api/review', middleware.ensureAuthenticated, middleware.getUser, middleware.ensureUserOwnsBook, async (req, res) => {
    // console.log(req.body);
    const { bookID, review } = req.body;
    let foundBook = await Book.findById(bookID);

    if (!foundBook) {
      console.log('ERROR on retrieving book ' + req.params.id + ' from MongoDB');
      res.json({ 'error': errors.NO_BOOK });
      return false;
    };

    const userAlreadyCommentOnBook = foundBook.comments.find( comment =>
      comment.userID == req.currentUser._id
    );

    if (userAlreadyCommentOnBook)
      return res.json({ error: errors.ALREADY_COMMENTED });

    let saved = await addCommentToBook(foundBook, req.currentUser._id, review);

    res.json({ saved });
  });
  
  app.get('/api/recent', async (req, res) => {
    Book.find().
    limit(FEED_MAX_BOOKS).
    sort({ lastMarkedAsOwned: -1 }).
    // select({ name: 1, occupation: 1 }).
    exec(function(err, recentlyAddedBooks) {
      res.json({ recentlyAdded: recentlyAddedBooks });
    });
  });
  
  app.get('/api/mostPopular', async (req, res) => { 
    Book.find().
      limit(FEED_MAX_BOOKS).
      sort({ likes: -1 }).
      exec(function (err, mostPopularBooks) {
        res.json({ mostPopular: mostPopularBooks });
      });
  });

  app.get('/api/mostOwned', async (req, res) => {
  });

    // const allSwipes = await User.aggregate(
    //   [
    //     {
    //       "$group": {
    //           "_id": 0,
    //         "swipes": { "$push": "$swipes" }
    //       }
    //     },
    //     {
    //       "$project": {
    //         "swipes": {
    //           "$reduce": {
    //             "input": "$swipes",
    //             "initialValue": [],
    //             "in": { "$concatArrays": ["$$value", "$$this"] }
    //           }
    //         }
    //       }
    //     }
    //   ]
    // );
    
    // let swipes = allSwipes[0].swipes.filter( swipe => swipe.like === true );

    // swipes = middleware.groupBy(swipes, 'bookID');
  
    // // console.log(swipes);

    // for (let key of Object.keys(swipes)) {
    //   console.log(key, swipes[key].length);
    // }

    // res.json(
    //   { recentlyAdded: recentlyAddedBooks }
    // );

}