const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const errors = require('../config/errors');

const GoodReadsAPI = require('goodreads-api-node');
const Goodreads_KEY = require('../config/goodreads');
const goodreads = GoodReadsAPI(Goodreads_KEY);

const User = mongoose.model('users');
const Book = mongoose.model('books');
const Match = mongoose.model('matches');

const middleware = require('../common/middleware');
const matchStatus = require('../config/matchStatus');

alertUsersWithMail = (user1, user2) => {
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
};

module.exports = (app) => {

  /**
   * If a book exists in the OwnedBook collection, it means that some user has declared that he owns that book and put it up for exchange.
   * So basically all books in the OwnedBooks collection are good for display using the "user-next-swipe" post request.
   * However, there are 2 conditions under which a book will recurse:
   * 1 - If the userID in the OwnedBook record matches the userID of the current user - it's his own book and he shouldn't see it while swiping
   * 2 - If he already swept on it prior, he shouldn't see it either anymore.
   */
  app.get('/api/books', middleware.ensureAuthenticated, (req, res) => {
      const MAX_BATCH_SIZE = 20;
    
      let currentUserID = req.session.passport.user;
      let swipes = []; // init empty array for books available for swiping
    
      Book.find({}, function (err, allBooks) {
        middleware.getUser(currentUserID, currentUser => {
          User.
            find({}).
            where('_id').ne(currentUserID).
            limit(MAX_BATCH_SIZE).
            select('username ownedBooks').
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
                    // console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.username + ' already swiped it.');
                  };
                  if (isBookOwnedByCurrentUser) {
                    // console.log('Skipping ' + bookInfo.title + ' due to user ' + currentUser.username + ' already owning it.');
                  };
    
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
                      numofPages: bookInfo.numOfPages
                    }
                    
                    // console.log(swipes.length);
                    swipes.push(addSwipe);
                  }
                  // console.log('pushed userID ' + possibility._id+ ' with bookID ' + ownedBook.bookID);
                }
              }
    
              res.end( JSON.stringify(
                {
                  books: swipes
                }
              ));
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
    
  // goodreads.getBooksByAuthor('656983');
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
    
  app.get('/api/books/:id', async (req, res) => {
    console.log(req.params.id);

    const foundBook = await Book.findOne(
        {
          _id: new ObjectId(req.params.id)
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

      res.end(JSON.stringify(
        {
          book: foundBook
        }
      ));
  });

  app.get('/api/myShelf/search/book/:id', async (req, res) => {
    console.log(req.params.id);

    const result = await goodreads.showBook(req.params.id);

    // console.log(result.book);

    if (!result) {
      console.log('ERROR on retrieving book ' + req.params.id + ' from Goodreads');
      res.end(JSON.stringify(
          {
            'error': errors.NO_GOODREADS_RESULT
          }
      ));
      return false;
    }

    res.end(JSON.stringify(
      {
        book: 
          {
            goodreadsID: req.params.id,
            author: middleware.parseAuthorName(result.book),
            title: result.book.title,
            imageURL: result.book.image_url,
            description: result.book.description,
            numOfPages: result.book.num_pages
          }
      }
    ));
  });

  /**
   * Check for ANY book match between two users
   * @param {*} currentUser 
   * @param {*} ownerID 
   */
  checkForMatch = (liked, currentUser, owner, swipedBookID) => {
    // so currently I already KNOW that currentUser has JUST swiped yes on some book that ownerID possesses.
    // now need to loop over the swipes array of ownerID and check if he has done a YES swipe on ANY book that currentUser has on his ownedBooks array
    return new Promise( (resolve, reject) => {

      if (!liked || !owner.swipes) {
        resolve(false);
        return;
      };

      let foundMatch = false;

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
              if (err) {
                reject(err);
                return;
              };
            
              console.log('Match Saved:');
              console.log(saved);

              foundMatch = true;
              // TODO: Mail alert both users with deep link to match when a new match
            });
          }
        }
      }

      resolve(foundMatch);
    });
  };

  likeOrRejectBook = (currentUserID, ownerID, bookID, liked) => {
    return new Promise( (resolve, reject) => {

      middleware.getUser(currentUserID, currentUser => {
        let likedOrRejected = {
          bookID: bookID,
          like: liked,
          dateAdded: Date.now()
        };
          
        currentUser.swipes.push(likedOrRejected);

        currentUser.save(function (err, saved) {  
          if (err) {
            reject(err);
            return;
          };

          console.log('Saved swipe [' + liked + '] for book ' + bookID + ' for user ' + currentUserID);

          if (!liked) {
            resolve(false);
            return;
          }

          // if swipe was a YES - alert both users with a mail
          middleware.getUser(ownerID, async (owner) => {
            const newMatch = await checkForMatch(liked, currentUser, owner, bookID);
            // alertUsersWithMail(currentUser, owner);
            resolve(true);
          });

        });
      });
    });
  };

  app.post('/api/books/liked', middleware.ensureAuthenticated, async (req, res) => {
    const liked = await likeOrRejectBook( req.session.passport.user, req.body.ownerID, req.body.bookID, true);

    res.end(JSON.stringify(
      {
        liked: liked
      }
    ));
  });

  app.post('/api/books/rejected', middleware.ensureAuthenticated, async (req, res) => {
    const liked = await likeOrRejectBook( req.session.passport.user, req.body.ownerID, req.body.bookID, false);

    res.end(JSON.stringify(
      {
        liked: liked
      }
    ));
  });

  app.get('/api/recent', async (req, res) => {
    const MAX_BOOKS = 8;
  
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
      // console.log(recentlyAddedBooks);
      res.end(JSON.stringify(
        { recentlyAdded: recentlyAddedBooks }
      ));
    });
  });
}