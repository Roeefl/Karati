const mongoose = require("mongoose");
const errors = require("../config/errors");
const middleware = require("../common/middleware");
const Book = mongoose.model("books");

const GoodReadsAPI = require('goodreads-api-node');
const Goodreads_Credentials = {
  key: process.env.GOODREADS_KEY,
  secret: process.env.GOODREADS_SECRET
};
const goodreads = GoodReadsAPI(Goodreads_Credentials);

getBookFromMongoByGoodreadsID = goodreadsID => {
    return new Promise((resolve, reject) => {
        Book.findOne({ goodreadsID },
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
 * @param {*} bookID
 * @param {*} goodreadsID
 */
addOwnedBookByUser = (currentUser, bookID, goodreadsID) => {
    return new Promise( (resolve, reject) => {
       
        let isBookOwnedByUser = false;
        if (currentUser.ownedBooks) {
            isBookOwnedByUser = currentUser.ownedBooks.find(
                book => book.bookID === bookID
            );
        }

        if (isBookOwnedByUser) {
            console.log(`BookID ${bookID} is already linked to UserID ${currentUser._id}`);
            resolve(false);
            return;
        } else {
            const newOwnedBook = {
                bookID,
                goodreadsID,
                dateAdded: Date.now()
            };

            currentUser.ownedBooks.push(newOwnedBook);

            if (!currentUser.passedIntro && currentUser.ownedBooks.length >= 5) {
                currentUser.passedIntro = true;
            }

            currentUser.save(function (err, saved) {
                if (err) {
                    reject(err);
                    return;
                }

                console.log(`addBookToUser saved book ${bookID} to  ${currentUser._id}`);
                resolve(true);
            });
        }
    });
};

module.exports = app => {

    // List all books on myShelf
    app.get("/api/myShelf", middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        const allBooks = await Book.findInIdArray( req.currentUser.ownedBooks.map( book => book.bookID ) );

        const myShelf = req.currentUser.ownedBooks.map(myBook => {
            return allBooks.find(book =>
                book._id == myBook.bookID
            );
        });

        res.json({ myShelf });
    });

    // // Get one particular book on myShelf
    // app.get("/api/myShelf/:id", middleware.ensureAuthenticated, middleware.getUser, (req, res) => {
    //     res.json({
    //         book: allBooks.find(book =>
    //             book._id == req.params.id
    //         )
    //     });
    // });

    // Update availability for a book on myShelf
    app.put("/api/myShelf/:id", middleware.ensureAuthenticated, middleware.getUser, (req, res) => {

        let currBook = req.currentUser.ownedBooks.find(book =>
            book.bookID == req.params.id
        );

        currBook.available = req.body.available;

        req.currentUser.save(function (err, saved) {
            if (err) {
                console.log(err);
                return;
            }
            
            res.json({ updated: true });
        });
    });

    // Delete a book from myShelf
    app.delete("/api/myShelf/:id", middleware.ensureAuthenticated, middleware.getUser, (req, res) => {
        let currentUser = req.currentUser;

        currentUser.ownedBooks = currentUser.ownedBooks.filter( ownedBook => ownedBook.bookID != req.params.id);

        currentUser.save(function (err, saved) {
            if (err) {
                console.log(err);
                return;
            }
            
            res.json({ removed: true });
        });
    });

    /**
     * Adds a book selected by user to mark as 'owned' to ownedBooks collection
     * If book does not exist in books collection, adds the book to it first, then to ownedBooks.
     */
    // Add a book to myShelf
    app.post("/api/myShelf", middleware.ensureAuthenticated, middleware.getUser, async (req, res) => {
        const { goodreadsID } = req.body;

        let existingBook = await getBookFromMongoByGoodreadsID(goodreadsID);

        // console.log(existingBook);

        let bookID = null;
        if (existingBook) {
            bookID = existingBook._id;

            console.log(`updating timeStamp for book ${bookID}`);
            existingBook.lastMarkedAsOwned = Date.now();

            await existingBook.save();
        } else {
            console.log("Adding book to MongoDB /books: " + goodreadsID);

            const result = await goodreads.showBook(goodreadsID);

            let newBook = middleware.parseBookDataObjFromGoodreads(
                goodreadsID,
                result
            );
            const saved = await newBook.save();

            bookID = saved._id;
            console.log("Book added succesfully to MongoDB /books: " + bookID);
        }

        let bookAddedToMyShelf = await addOwnedBookByUser(
            req.currentUser,
            bookID,
            goodreadsID
        );

        res.json({ bookAddedToMyShelf });
    });

    app.post('/api/myShelf/search/book/:id', async (req, res) => { 
        const { id } = req.params;

        try {
            const result = await goodreads.showBook(id);

            // console.log(result.book);
            // console.log(result.book.popular_shelves.shelf);

            if (!result) {
                console.log(`ERROR on retrieving book ${id} from Goodreads`);
                res.json({ 'error': errors.NO_GOODREADS_RESULT });
                return false;
            }

            let book = middleware.parseBookDataObjFromGoodreads(id, result);
            res.json({ book });
        } catch (e) {
            res.status(500).json({ error: errors.NO_GOODREADS_RESULT });
        }
      });
};
