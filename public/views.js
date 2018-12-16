let views = {

    default: 'main',

    currentBook: null,

    main: {
        render: function(callback) {
            callback (`
                <div>
                    <div class="main-intro">
                    קראתי
                    קראת? החלפת
                    יאללה, אני רוצה לנסות
                    </div>
                    <div class="main-recent-books">
                    </div>
                    <div class="main-features">
                    </div>
                    <div class="main-how-to-use">
                    </div>
                </div>
            `);
        }
    },

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

    showbook: { 
        render: function(callback) {
            callback (`
                <div class="view-container">
                    <div class="view-upper">
                        <div id="view-upper-container" class="view-inner-container">
                            <div class="view-upper-title">
                                Book Information
                            </div>
                            <div class="view-upper-sep">
                            </div>
                            <div class="view-upper-subtitle">
                                Here you can see all the relevant info for the book you chose
                            </div>
                        </div>
                    </div>
                    <div class="view-control">
                        <div id="view-control-container" class="view-inner-container">
                            
                        </div>
                    </div>
                    <div class="view-data">
                        <div id="view-data-container" class="view-inner-container">
                            <div class="grid-book">
                                <div class="book-container">
                                    <div class="info">
                                        <div class="info-upper">
                                            <div class="title">${views.currentBook.title}</div>
                                            <div class="author">${views.currentBook.author}</div>
                                        </div>
                                        <div class="info-lower">
                                            <div class="owned-by"></div>
                                        </div>
                                    </div>
                                    <div class="image">
                                        <img src="${views.currentBook.imageURL}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `); 
        }
    },

    match: {
        new: function(matchData) {
            return {
                id: `match_${Math.random()}`,
                data: matchData,
                myBook: matchData.myBook,
                otherBook: matchData.otherBook,

                state: {
                    // smileClass: 'flame'
                },

                render: function() {
                    return `        
                    <li class="grid-match">
                        <a href="#openmatch">
                            <div class="match-container" onclick="onAction('${this.id}', 'setCurrentMatch', event)">
                                <div class="match-book other-book">
                                    <div class="match-book-container">
                                        <div class="owner">
                                            <div class="owner-inner">
                                                <div>This book is offered for exchange by:</div>
                                                <div>${this.otherBook.owner}</div>
                                            </div>
                                        </div>
                                        <div class="details">
                                            <div class="image">
                                                <img src="${this.otherBook.imageURL}"/>
                                            </div>
                                            <div class="info">
                                                <div class="upper">
                                                    <div class="title">${this.otherBook.title}</div>
                                                    <div class="author">${this.otherBook.author}</div>
                                                </div>
                                                <div class="lower">
                                                    <div class="desc">${this.otherBook.desc}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="swap">
                                    <button class="swap-books">
                                        <i class="fas fa-retweet"></i>
                                        <span>Swap!</span>
                                    </button>
                                </div>
                                <div class="match-book my-book">
                                    <div class="match-book-container">
                                        <div class="owner">
                                            <div class="owner-inner">Your Book:</div>
                                        </div>
                                        <div class="details">
                                            <div class="image">
                                                <img src="${this.myBook.imageURL}"/>
                                            </div>
                                            <div class="info">
                                                <div class="upper">
                                                    <div class="title">${this.myBook.title}</div>
                                                    <div class="author">${this.myBook.author}</div>
                                                </div>
                                                <div class="lower">
                                                    <div class="desc">${this.myBook.desc}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                    `;
                }
            }
        }
    },

    mymatches: {
        new: function () {
            return {
                id: `mymatches_${Math.random()}`,

                matches: [],
                noMatches: false,

                render: function(callback) {
                    if (this.noMatches) {
                        callback(`
                            <div id="grid-matches">
                                NO MATCHES!
                            </div>
                        `);
                    } else {
                        request('/api/myMatches', data => {
                            let pData = JSON.parse(data);
            
                            if (pData.error) {
                                if (pData.error == 33) {
                                    this.noMatches = true;
                                    reRender(this);
                                } else if (pData.error == 30) {
                                    //  'NOT_LOGGED_IN'  : '30'
                                    callback(`
                                        <div id="not-logged-in">
                                            Error: not logged into system.
                                        </div>
                                    `);
                                }
                            } else {
                                for (let match of pData.myMatches) {
                                    this.matches.push(views.match.new(match));
                                }
                                
                                callback(`
                                    <div class="view-container">
                                        <div class="view-upper">
                                            <div id="view-upper-container" class="view-inner-container">
                                                <div class="view-upper-title">
                                                    My Matches
                                                </div>
                                                <div class="view-upper-sep">
                                                </div>
                                                <div class="view-upper-subtitle">
                                                    All matches between your owned books and books of other users
                                                </div>
                                            </div>
                                        </div>
                                        <div class="view-control">
                                            <div id="view-control-container" class="view-inner-container">
                                                Control
                                            </div>
                                        </div>
                                        <div class="view-data">
                                            <div id="view-data-container" class="view-inner-container">
                                                <ul class='grid-matches'>
                                                    ${this.matches.map(match => match.render()).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                `);
                            }
                        });
                    }
                },
            }
        }
    },

    myshelf: {
        new: function() {
            return {
                children: [],

                render: function(callback) {
                    request('/api/myShelf', data => {
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
                            console.log(pData.myShelf);
                            for (let bookData of pData.myShelf) {
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
                id: (bookData.id ? bookData.id._ : (bookData._id || Date.now())),
                bookInfo: bookData,
                isFromGoodreads: isFromGR,

                bookID: '',
                author: '',
                title: bookData.title,
                imageURL: '',
                action:  'doNothing',


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

                    console.log(data.goodreadsID);
        
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

                setCurrentBook: function(event, done) {
                    views.currentBook = this;
                },

                render: function() {        
                    if (this.isFromGoodreads) {
                        this.author = this.bookInfo.author.name;
                        this.imageURL = this.bookInfo.image_url;
                        this.bookID = this.bookInfo.id._;
                        this.action = 'userAddOwnedBook';
                    } else {
                        this.author = this.bookInfo.author;
                        this.imageURL = this.bookInfo.imageURL;
                        this.bookID = this.bookInfo._id;
                    }

                    // <a href="#showbook">
                    // </a>

                    // <div class="owned-by"></div>
        
                    return `
                        <li class="grid-book">
                                <div class="book-container" onclick="onAction('${this.id}', 'setCurrentBook', event)">
                                    <div class="info">
                                        <div class="info-upper">
                                            <div class="title">${this.title}</div>
                                            <div class="author">${this.author}</div>
                                        </div>
                                        <div class="info-lower">
                                            
                                            <div class="add-book">
                                                <button onclick="onAction('${this.id}', 'userAddOwnedBook', event)">
                                                    <i class="fas fa-plus-circle"></i> I own this book!
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="image">
                                        <img src="${this.imageURL}">
                                    </div>
                                </div>
                        </li>
                    `;
                }
            }
        }
    },

    swipe: {
        new: function() {
            return  {
                id: `swipes_${Math.random()}`,

                availableSwipes: [],
                noMoreSwipes: false,
                notLoggedIn: false,
        
                getBatch: function(e, done) {
                    request('/api/matches/browse', data => {
                        let pData = JSON.parse(data);
        
                        // console.log(views.swipe.availableSwipes);
        
                        if (pData.error) {
                            if (pData.error == 30) {
                                //  'NOT_LOGGED_IN'  : '30'
                                this.notLoggedIn = true;
                                reRender(this);

                            } else if (pData.error == 31) {
                                this.noMoreSwipes = true;
                                reRender(this);
                            }
                        } else {
                            this.availableSwipes = pData;
                            reRender(this);
                        }
                    });
                },
        
                render: function(callback) {
                    if (this.notLoggedIn) {
                        callback(`
                        <div id="not-logged-in">
                            Error: not logged into system.
                        </div>
                    `);
                    } else if (this.noMoreSwipes) {
                        callback(`
                            <div id="swipe-container">
                                No more books around your location!
                            </div>
                        `);
                    } else if (this.availableSwipes.length === 0) {
                        onAction(this.id, 'getBatch', null);
                    } else {
        
                        // currently contains available swipes - go through them
                        let currentSwipe = this.availableSwipes[0];
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
                                            <form action="/user-swipe-book" method="POST" onsubmit="onAction('${this.id}', 'nextBook', event)">
                                                <input type="text" style="display: none;" name="bookid" value="${currentSwipe.bookID}">
                                                <input type="number" style="display: none;" name="like" value='1'>
                                                <button type="submit"><i class="fas fa-heart flame"></i></button>
                                            </form>
                                        </span>
                                        <span class="book-func round-frame">
                                            <form action="/user-swipe-book" method="POST" onsubmit="onAction('${this.id}', 'nextBook', event)">
                                                <input type="text" style="display: none;" name="bookid" value="${currentSwipe.bookID}">
                                                <input type="number" style="display: none;" name="like" value='0'>
                                                <button type="submit"><i class="fas fa-thumbs-down buff"></i></button>
                                            </form>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        `);
                    }
                },
        
                nextBook: function(event, done) {
                    event.preventDefault();

                    let currentSwipe = this.availableSwipes[0];

                    console.log(event.target.like.value);
        
                    var data = {
                        bookID: event.target.bookid.value,
                        like: (event.target.like.value == '1'),
                        ownerID: currentSwipe.ownerID
                    };
        
                    $.post('/user-swipe-book', data, result => {
                        // remove swiped from available swipes
                        this.availableSwipes.shift();

                        done();
                    });
                }
            }
        }
    },

    query: {
        new: function() {
            return {
                id: `query_${Math.random()}`,
                children: [],
                failedQuery: false,

                render: function(callback) {
                    if (this.failedQuery) {
                        callback(`
                        <div id="not-logged-in">
                            Error: not logged into system.
                        </div>
                        `);
                    } else {
                        callback(`
                        <div class="view-container">
                            <div class="view-upper">
                                <div id="view-upper-container" class="view-inner-container">
                                    <div class="view-upper-title">
                                        Search the book database
                                    </div>
                                    <div class="view-upper-sep">
                                    </div>
                                    <div class="view-upper-subtitle">
                                        Enter a part of the title, the author name, etc...
                                    </div>
                                </div>
                            </div>
                            <div class="view-control">
                                <div id="view-control-container" class="view-inner-container">
                                    <form class="search-books" action="/api/books/search" method="GET" onsubmit="onAction('${this.id}', 'search', event)">
                                        <input type="text" placeholder="Tolkien" name="query">
                                        <button type="submit" class="btn-prime">Search using GoodReads API</button>
                                    </form>
                                </div>
                            </div>
                            <div class="view-data">
                                <div id="view-data-container" class="view-inner-container">
                                    <ul class="grid-books">
                                        ${this.children.map(child => child.render()).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        `);
                    }
                },
        
                search: function(event, done) {
                    event.preventDefault();
        
                    var data = {
                        query: event.target.query.value
                    };
        
                    // $.post('/goodreads-search-books', data, results => {
                    $.post(event.target.action, data, results => {
                        let pData =  JSON.parse(results);

                        console.log(pData.books);

                        for (let book of pData.books) {
                            // console.log(bookData);
                            this.children.push(
                                views.book.new(book, true)
                            );
                        }

                        done();
                    });
                }
            }
        }
    }
}