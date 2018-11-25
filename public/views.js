let views = {

    default: 'list_db',

    loading: function() {
        return `
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
        `;
    },

    list_db: function(callback) {
        request('books', data => {
            let pData = JSON.parse(data);

            if (pData.error) {
                if (pData.error == 30) {
                    //  'NOT_LOGGED_IN'  : '30'
                    callback(`
                        <div id="not-logged-in">
                            Error: not logged into system.
                        </div>
                    `);
                }
            } else {
                callback(`
                    <table id="all-books" class="table is-bordered is-hoverable">
                        <thead>
                            <tr>
                            <th><abbr title="Position">_ID</abbr></th>
                            <th><abbr title="Author">Author</abbr></th>
                            <th><abbr title="Title">Title</abbr></th>
                        </thead>
                        <tbody id='all-books-content'>
                            ${pData.map(book =>
                                `<tr>
                                    <td>${book._id}</td>
                                    <td>${book.author}</td>
                                    <td>${book.title}</td>
                                </tr>
                                `
                            ).join('')
                            }
                        </tbody>
                    </table>
                `);
            }
        });
    },

    about: function(callback) {
        callback(`
            <div>
                Nothing
            </div>
        `);
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
                        reRender('swipe');
                    }
                } else {
                    reRender('swipe');
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
                reRender('swipe');
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

        pResults: [],

        render: function(callback) {
            callback(`
                <div>
                    <div id="goodreads-query">
                        <form action="/goodreads-search-books" method="GET" onsubmit="onAction('query', 'search', event)">
                            <input type="text" placeholder="Tolkien" name="query">
                            <button type="submit" class="btn-prime fillup">Search using GoodReads API</button>
                        </form>
                    </div>
                    <ul id="grid-books">
                        ${views.query.pResults.map(result =>
                            `<li class="grid-book">
                                <img class="book-img" src="${result.best_book.image_url}">
                                <span class="book-desc">${result.best_book.title} by ${result.best_book.author.name}</span>
                                <span class="book-options">
                                    <span class="book-func">
                                        <form action="/user-add-owned-book" method="POST" onsubmit="onAction('query', 'userAddOwnedBook', event)">
                                            <input type="text" style="display: none;" name="goodreadsid" value="${result.best_book.id._}">
                                            <button type="submit"><i class="fas fa-plus-circle"></i></button>
                                        </form>
                                    </span>
                                    <span class="book-func">
                                        <i class="fas fa-grin-hearts"></i>
                                    </span>
                                </span>
                            </li>
                            `
                            ).join('')
                        }
                    </ul>
    
                </div>
            `)
        },

        search: function(event) {
            event.preventDefault();

            var data = {
                query: event.target.query.value
            };

            // $.post('/goodreads-search-books', data, results => {
            $.post(event.target.action, data, results => {
                views.query.pResults =  JSON.parse(results);
                if (views.query.pResults.error) {
                    console.log('data error');
                }
                render('query');
            });
        },

        userAddOwnedBook: function(event) {
            event.preventDefault();

            var data = {
                goodreadsID: event.target.goodreadsid.value
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
            });
        }
    }
}