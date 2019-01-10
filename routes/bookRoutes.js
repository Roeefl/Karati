const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const errors = require('../config/errors');
const middleware = require('../common/middleware');

const genreList = require('../common/genres');

const GoodReadsAPI = require('goodreads-api-node');
const Goodreads_Credentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET
};
const goodreads = GoodReadsAPI(Goodreads_Credentials);

const User = mongoose.model('users');
const Book = mongoose.model('books');
// const Match = mongoose.model('matches');

addCommentToBook = (book, userID, comment) => {
  return new Promise( (resolve, reject) => {

    let newComment = {
      userID: userID,
      content: comment,
      dateAdded: Date.now()
    };

    if (!book.comments) {
      book.comments = [];
    }

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

module.exports = (app) => {

  app.get('/api/genres', async (req, res) => {
    res.json(
      {
        genres: genreList.list
      }
    )
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
    const MAX_BATCH_SIZE = 20;

    let currentUserID = req.session.passport.user;
    
    let swipes = []; // init empty array for books available for swiping

    let allBooks = await Book.find();

    User.
      find({}).
      where('_id').ne(currentUserID).
      limit(MAX_BATCH_SIZE).
      select('username ownedBooks').
      exec(function (err, usersWithPossibleBooksForSwiping) {
        for (let possibility of usersWithPossibleBooksForSwiping) {
          for (let ownedBook of possibility.ownedBooks) {

            let currBookID = ownedBook.bookID;
            let bookInfo = allBooks.find(book =>
              book._id == currBookID
            );

            let isBookSwipedByCurrentUser = false;
            if (req.currentUser.swipes) {
              isBookSwipedByCurrentUser = req.currentUser.swipes.find(swipe =>
                swipe.bookID == currBookID
              );
            }

            let isBookOwnedByCurrentUser = false;
            if (req.currentUser.ownedBooks) {
              isBookOwnedByCurrentUser = req.currentUser.ownedBooks.find(ownedBook =>
                ownedBook.bookID == currBookID
              );
            }

            // If not yet swiped by currentUser - push into available swipes
            if (!isBookSwipedByCurrentUser && !isBookOwnedByCurrentUser) {
              // console.log('adding to swipes');
              // console.log(bookInfo)
              let addSwipe = {
                ownerID: possibility._id,
                ownedBy: possibility.username,
                bookID: currBookID,
                author: bookInfo.author,
                title: bookInfo.title,
                imageURL: bookInfo.imageURL,
                desc: bookInfo.description,
                numofPages: bookInfo.numOfPages,
                publicationYear: bookInfo.publicationYear,
                averageRating: bookInfo.averageRating,
                genres: bookInfo.genres,
                comments: bookInfo.comments
              }

              // console.log(swipes.length);
              swipes.push(addSwipe);
            }
            // console.log('pushed userID ' + possibility._id+ ' with bookID ' + ownedBook.bookID);
          }
        }

        res.json(
          {
            availableSwipes: swipes
          }
        );
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

  // Get one particular book that a user can swipe on
  app.get('/api/books/:id', async (req, res) => {
    console.log(req.params.id);

    const foundBook = await Book.findOne(
      {
        _id: new ObjectId(req.params.id)
      }
    );

    if (!foundBook) {
      console.log('ERROR on retrieving book ' + req.params.id + ' from MongoDB');

      res.json({
        'error': errors.NO_BOOK
      });
      
      return false;
    };

    for (let comment of foundBook.comments) {
      let userInfo = await User.findOne(
        {
          _id: new ObjectId(comment.userID)
        }
      );

      comment.username = (userInfo ? userInfo.username : 'User Not Found');
    }

    res.json({
      book: foundBook
    });
  });
    
  app.post('/api/books/search', async function searchGoodreads(req, res) {
    const FILTER_ALL = 'all';
    let query = req.body.query;
    let limit = req.body.limit;

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
      res.end( JSON.stringify(
        {
          books: books
        }
      ));
    } catch(e) {
        res.end( JSON.stringify(
          {
            books: books
          }
        ));
        return;
    }
  });
  
  app.post('/api/review', middleware.ensureAuthenticated, middleware.getUser, middleware.ensureUserOwnsBook, async (req, res) => {
    // console.log(req.body);
    const { bookID, review } = req.body;

    let foundBook = await Book.findOne(
        {
          _id: new ObjectId( bookID )
        }
    );

    if (!foundBook) {
      console.log('ERROR on retrieving book ' + req.params.id + ' from MongoDB');

      res.end(JSON.stringify(
          {
            'error': errors.NO_BOOK
          }
      ));

      return false;
    };

    let userAlreadyCommentOnBook = foundBook.comments.find( comment =>
      comment.userID == req.currentUser._id
    );
    if (userAlreadyCommentOnBook) {
      return res.end(JSON.stringify(
        {
          error: errors.ALREADY_COMMENTED
        }
      ));
    }

    let commentSaved = await addCommentToBook(foundBook, req.currentUser._id, review);
    res.end(JSON.stringify(
      {
        saved: commentSaved
      }
    ));
  });

  const MAX_BOOKS = 10;
  
  app.get('/api/recent', async (req, res) => {
    Book.find(
      {}
    ).
    limit(MAX_BOOKS).
    sort(
      {
        lastMarkedAsOwned: -1
      }
    ).
    // select({ name: 1, occupation: 1 }).
    exec(function(err, recentlyAddedBooks) {
      res.end(JSON.stringify(
        { recentlyAdded: recentlyAddedBooks }
      ));
    });
  });
  
  app.get('/api/mostPopular', async (req, res) => { 
    Book.find(
      {}
    ).
      limit(MAX_BOOKS).
      sort(
        {
          likes: -1
        }
      ).
      exec(function (err, mostPopularBooks) {
        res.json(
          { mostPopular: mostPopularBooks }
        );
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