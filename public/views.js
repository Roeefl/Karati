let views = {

    default: 'myshelf',

    loading: {
        render: function(callback) {
            callback(`
                <div id="loader-container">
                    <div class="book">
                        <div class="book__pages">
                            <div class="book__page book__page--left"></div>
                            <div class="book__page book__page--right"></div>
                    
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                            <div class="book__page book__page--right book__page--animated"></div>
                        </div>
                    </div>
                </div>
            `);
        }
    },

    about: {
        render: function(callback) {
            callback(`
            <div>
                Nothing
            </div>
        `);
        }
    },

    myshelf: {
        new: function() {
            return {
                children: [],

                render: function(callback) {
                    request('my-shelf', data => {
                        let pData = JSON.parse(data);
        
                        if (pData.error) {
                            if (pData.error == 30) {
                                //  'NOT_LOGGED_IN'  : '30'
                                callback(`
                                    <div id="not-logged-in">
                                        Error: not logged into system.
                                    </div>
                                `);
                            } else if (pData.error == 32) {
                                callback(`
                                    <div id="shelf-is-empty">
                                        Your shelf is empty.
                                    </div>
                                `);
                            }
                        } else {
                            for (let bookData of pData) {
                                this.children.push(
                                    views.book.new(bookData, false)
                                );
                            }

                            callback(`
                                <ul class='grid-books'>
                                    ${this.children.map(child => child.render()).join('')}
                                </ul>
                            `);
                        }
                    });
                }
            }
        }
    },

    book: {
        new: function(bookData, isFromGR) {
            return {
                id: `book_${Math.random()}`,
                bookInfo: bookData,
                isFromGoodreads: isFromGR,
                state: {
                    smileClass: 'flame'
                },
                toggleSmile: function(e, done) {
                    if (this.state.smileClass == 'flame') {
                        setState(this.id, {smileClass: 'pineapple'}, success => {
                            console.log(this.state);
                        });
                    } else {
                        setState(this.id, {smileClass: 'flame'}, success => {
                            console.log(this.state);
                        });
                    }

                    done();
                },

                doNothing: function(e, done) {
                    done();
                },

                userAddOwnedBook: function(event, done) {
                    event.preventDefault();
        
                    var data = {
                        goodreadsID: this.bookInfo.id._
                    };
        
                    $.post('/user-add-owned-book', data, response => {
                        let pResponse = JSON.parse(response);

                        if (pResponse.error) {
                            console.log('data error');
                        }

                        if (pResponse.saved) {
                            alert('Book saved to User');
                        } else {
                            alert('Book already attached to User');
                        }

                        done();
                    });
                },

                render: function() {
                    let author = '';
                    let imageURL = '';
                    let bookID = '';
                    let title = this.bookInfo.title;
                    let action = 'doNothing';
        
                    if (this.isFromGoodreads) {
                        author = this.bookInfo.author.name;
                        imageURL = this.bookInfo.image_url;
                        bookID = this.bookInfo.id._;
                        action = 'userAddOwnedBook';
                    } else {
                        author = this.bookInfo.author;
                        imageURL = this.bookInfo.imageURL;
                        bookID = this.bookInfo._id;
                    }
        
                    return `
                        <li class="grid-book">
                            <img class="book-img" src="${imageURL}">
                            <span class="book-desc">${title} by ${author}</span>
                            <span class="book-options">
                                <span class="book-func">
                                    <button onclick="onAction('${this.id}', '${action}', event)">
                                        <i class="fas fa-plus-circle"></i>
                                    </button>
                                </span>
                                <span class="book-func">
                                    <button onclick="onAction('${this.id}', 'toggleSmile', event)">
                                        <i class="fas fa-grin-hearts ${this.state.smileClass}"></i>
                                    </button>
                                </span>
                            </span>
                        </li>
                    `;
                }
            }
        }
    },

    swipe: {

        availableSwipes: [],
        noMoreSwipes: false,

        getBatch: function(callback) {
            request('/user-get-swipes-batch', data => {
                views.swipe.availableSwipes = JSON.parse(data);

                // console.log(views.swipe.availableSwipes);

                if (views.swipe.availableSwipes.error) {
                    if (views.swipe.availableSwipes.error == 31) {
                        views.swipe.noMoreSwipes = true;
                        reRender(this);
                    }
                } else {
                    reRender(this);
                }
            });
        },

        render: function(callback) {
            if (views.swipe.noMoreSwipes) {
                callback(`
                    <div id="swipe-container">
                        No more books around your location!
                    </div>
                `);
            } else if (views.swipe.availableSwipes.length === 0) {
                views.swipe.getBatch(callback);
            } else {

                // currently contains available swipes - go through them
                let currentSwipe = views.swipe.availableSwipes[0];
                let sTitle = currentSwipe.title.substring(0, 70);

                // console.log(currentSwipe);
                
                callback(`
                    <div id="swipe-container">
                        <div class="grid-book">
                            <span class="book-frame round-frame">
                                <img class="book-img" src="${currentSwipe.imageURL}">
                                <span class="book-desc buff">${sTitle}</span>
                                <span class="book-desc buff">by ${currentSwipe.author}</span>
                                <span class="book-desc buff">Offered for exchange by <span class="flame">${currentSwipe.ownedBy}</span>
                            </span>
                            <span class="book-options">
                                <span class="book-func round-frame">
                                    <form action="/user-swipe-book" method="POST" onsubmit="onAction('swipe', 'swipeYes', event)">
                                        <input type="text" style="display: none;" name="bookid" value="${currentSwipe.bookID}">
                                        <button type="submit"><i class="fas fa-heart flame"></i></button>
                                    </form>
                                </span>
                                <span class="book-func round-frame">
                                    <form action="/user-swipe-book" method="POST" onsubmit="onAction('swipe', 'swipeNo', event)">
                                        <input type="text" style="display: none;" name="bookid" value="${currentSwipe.bookID}">
                                        <button type="submit"><i class="fas fa-thumbs-down buff"></i></button>
                                    </form>
                                </span>
                            </span>
                        </div>
                    </div>
                `);
            }
        },

        nextBook: function(swipeYes) {
            let currentSwipe = views.swipe.availableSwipes[0];

            var data = {
                bookID: event.target.bookid.value,
                like: swipeYes,
                ownerID: currentSwipe.ownerID
            };

            $.post('/user-swipe-book', data, result => {
                views.swipe.availableSwipes.shift(); // remove swiped from available swipes
                reRender();
            });
        },
        swipeYes: function(event) {
            event.preventDefault();
            views.swipe.nextBook(true);
        },
        swipeNo: function(event) {
            event.preventDefault();
            views.swipe.nextBook(false);
        }
    },

    query: {
        new: function() {
            return {
                id: `query_${Math.random()}`,
                children: [],

                render: function(callback) {
                    callback(`
                        <div>
                            <div id="goodreads-query">
                                <form action="/goodreads-search-books" method="GET" onsubmit="onAction('${this.id}', 'search', event)">
                                    <input type="text" placeholder="Tolkien" name="query">
                                    <button type="submit" class="btn-prime fillup">Search using GoodReads API</button>
                                </form>
                            </div>
                            <ul class="grid-books">
                                ${this.children.map(child => child.render()).join('')}
                            </ul>
            
                        </div>
                    `)
                },
        
                search: function(event, done) {
                    event.preventDefault();
        
                    var data = {
                        query: event.target.query.value
                    };
        
                    // $.post('/goodreads-search-books', data, results => {
                    $.post(event.target.action, data, results => {
                        let parseResults =  JSON.parse(results);
                        if (parseResults.error) {
                            console.log('data error');
                        }

                        if (!Array.isArray(parseResults)) {
                            this.children.push(views.book.new(parseResults.best_book));
                        } else {
                            for (let bookData of parseResults) {
                                // console.log(bookData);
                                this.children.push(
                                    views.book.new(bookData.best_book, true)
                                );
                            }
                        }


                        done();
                    });
                }
            }
        }
    }
}