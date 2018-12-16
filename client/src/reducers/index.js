import { combineReducers } from 'redux';

import { authReducer } from  './auth';
import { selectedBookReducer } from  './selectedBook';
import { bookSearchReducer } from './bookSearch';
import { myBooksReducer } from './myBooks';
import { recentlyAddedRedcuer } from './recentlyAdded';
import { booksReducer } from './books';
import { myMatchesReducer } from './myMatches';
import { showBookReducer } from './showBook';

export default combineReducers(
    {
        auth: authReducer,
        searchResults: bookSearchReducer,
        selectedBook: selectedBookReducer,
        showBook: showBookReducer,
        myBooks: myBooksReducer,
        myMatches: myMatchesReducer,
        books: booksReducer,
        recentlyAdded: recentlyAddedRedcuer
    }
);