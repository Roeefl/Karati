const mongoose = require("mongoose");
const errors = require("../config/errors");
const middleware = require("../common/middleware");

const User = mongoose.model("users");
const Book = mongoose.model("books");
const Match = mongoose.model("matches");

const GoodReadsAPI = require("goodreads-api-node");
const Goodreads_KEY = {
    key: process.env.Goodreads_KEY,
    secret: process.env.GOODREADS_SECRET
  };
const goodreads = GoodReadsAPI(Goodreads_KEY);

getBookFromMongoByGoodreadsID = goodreadsID => {
    return new Promise((resolve, reject) => {
        Book.findOne(
            {
                goodreadsID: goodreadsID
            },
            function (err, existingBook) {
                if (err) {
                    reject(err);
                    return;
                }

                if (existingBook) {
                    resolve(existingBook);
                    return;
                }

                resolve(false);
            }
        );
    });
};

/**
 * Attaches a current book in the DB to a current user record in the DB in the collection ownedbooks
 * @param {*} userID
 * @param {*} bookID
 * @param {*} goodreadsID
 */
addOwnedBookByUser = (userID, bookID, goodreadsID) => {
    return new Promise((resolve, reject) => {
        middleware
            .getUser(userID)
            .then(foundUser => {
                let isBookOwnedByUser = false;
                if (foundUser.ownedBooks) {
                    isBookOwnedByUser = foundUser.ownedBooks.find(
                        book => book.bookID === bookID
                    );
                }

                if (isBookOwnedByUser) {
                    console.log(
                        "BookID " + bookID + " is already linked to UserID " + userID
                    );
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

                        console.log("addBookToUser saved book " + bookID + " to " + userID);
                        resolve(true);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    });
};

module.exports = app => {
    // List all books on myShelf
    app.get("/api/myShelf", middleware.ensureAuthenticated, async (req, res) => {
        let currentUser = await middleware.getUser(req.session.passport.user);

        let allBooks = await Book.find(
            {
                "_id": {
                    "$in": 
                        currentUser.ownedBooks.map( book => book.bookID )
                }
            }
        );

        let myShelf = currentUser.ownedBooks.map(myBook => {
            return allBooks.find(book =>
                book._id == myBook.bookID
            );
        });

        res.json({
            myShelf: myShelf
        });
    });

    // Get one particular book on myShelf
    app.get("/api/myShelf/:id", middleware.ensureAuthenticated, (req, res) => {
        middleware
            .getUser(req.session.passport.user)
            .then(currentUser => {
                res.json({
                    book: allBooks.find(book =>
                        book._id == req.params.id
                    )
                });
            })
            .catch(error => {
                res.json({
                    error: error
                });
            });
    });

    // Update availability for a book on myShelf
    app.put("/api/myShelf/:id", middleware.ensureAuthenticated, (req, res) => {
        middleware
        .getUser(req.session.passport.user)
        .then(currentUser => {

            let currBook = currentUser.ownedBooks.find(book =>
                book.bookID == req.params.id
            );

            currBook.available = req.body.available;

            currentUser.save(function (err, saved) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                res.json({
                    updated: true
                });
            });
        })
        .catch(error => {
            res.json({
                error: error
            });
        });
    });

    // Delete a book from myShelf
    app.delete("/api/myShelf/:id", middleware.ensureAuthenticated, (req, res) => {
        middleware
            .getUser(req.session.passport.user)
            .then(currentUser => {

                currentUser.ownedBooks = currentUser.ownedBooks.filter( ownedBook => ownedBook.bookID != req.params.id);

                currentUser.save(function (err, saved) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    res.json({
                        removed: true
                    });
                });
            })
            .catch(error => {
                res.json({
                    error: error
                });
            });
    });

    /**
     * Adds a book selected by user to mark as 'owned' to ownedBooks collection
     * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
     */
    // Add a book to myShelf
    app.post("/api/myShelf", middleware.ensureAuthenticated, async (req, res) => {
        let currentUserID = req.session.passport.user;

        let existingBook = await getBookFromMongoByGoodreadsID(
            req.body.goodreadsID
        );

        console.log(existingBook);

        let bookID;
        if (!existingBook) {
            console.log("Adding book to MongoDB /books: " + req.body.goodreadsID);

            const result = await goodreads.showBook(req.body.goodreadsID);

            let newBook = middleware.parseBookDataObjFromGoodreads(
                req.body.goodreadsID,
                result
            );
            const saved = await newBook.save();

            bookID = saved._id;
            console.log("Book added succesfully to MongoDB /books: " + bookID);
        } else {
            bookID = existingBook._id;

            console.log("updating timeStamp for book: " + bookID);
            existingBook.lastMarkedAsOwned = Date.now();
            await existingBook.save();
        }

        let saved = await addOwnedBookByUser(
            currentUserID,
            bookID,
            req.body.goodreadsID
        );

        res.end(
            JSON.stringify({
                bookAddedToMyShelf: saved
            })
        );
    });

    app.post('/api/myShelf/search/book/:id', async (req, res) => {
        console.log(req.params.id);
    
        const result = await goodreads.showBook(req.params.id);
    
        // console.log(result.book);
        // console.log(result.book.popular_shelves.shelf);
    
        if (!result) {
          console.log('ERROR on retrieving book ' + req.params.id + ' from Goodreads');
          res.end(JSON.stringify(
              {
                'error': errors.NO_GOODREADS_RESULT
              }
          ));
          return false;
        }
    
        let bookData = middleware.parseBookDataObjFromGoodreads(req.params.id, result);
        // console.log(bookData);
        res.end(JSON.stringify(
          {
            book: bookData
          }
        ));
      });
};
