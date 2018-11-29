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

    match: {
        new: function(matchData) {
            return {
                id: `match_${Math.random()}`,
                data: matchData,

                state: {
                    // smileClass: 'flame'
                },

                render: function() {
                    return `
                    <li class="match">
                        <img class="match-image" src="${this.data.imageURL}">
                        <span class="match-book-title">${this.data.title} by ${this.data.author}</span>
                        <span class="match-book-desc">${this.data.description}</span>
                        <span class="match-date-desc">${this.data.matchedOn}</span>
                        <span class="match-owner">${this.data.ownerName}</span>
                        <span class="match-status">${this.data.status}</span>
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
                        request('/user-get-matches', data => {
                            let pData = JSON.parse(data);
            
                            if (pData.error) {
                                if (pData.error == 33) {
                                    this.noMatches = true;
                                    reRender(this);
                                }
                            } else {
                                for (let match of pData) {
                                    this.matches.push(views.match.new(match));
                                }
                                
                                callback(`
                                    <ul class='grid-matches'>
                                        ${this.matches.map(match => match.render()).join('')}
                                    </ul>
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
        new: function() {
            return  {
                id: `swipes_${Math.random()}`,

                availableSwipes: [],
                noMoreSwipes: false,
        
                getBatch: function(e, done) {
                    request('/user-get-swipes-batch', data => {
                        this.availableSwipes = JSON.parse(data);
        
                        // console.log(views.swipe.availableSwipes);
        
                        if (this.availableSwipes.error) {
                            if (this.availableSwipes.error == 31) {
                                this.noMoreSwipes = true;
                                reRender(this);
                            }
                        } else {
                            reRender(this);
                        }
                    });
                },
        
                render: function(callback) {
                    if (this.noMoreSwipes) {
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