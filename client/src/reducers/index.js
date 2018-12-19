import { combineReducers } from 'redux';

import { authReducer } from  './auth';
import { selectedBookReducer } from  './selectedBook';
import { bookSearchReducer } from './bookSearch';
import { myBooksReducer } from './myBooks';
import { recentlyAddedRedcuer } from './recentlyAdded';
import { booksReducer } from './books';
import { myMatchesReducer } from './myMatches';
import { selectBookFromMongoReducer } from './selectBookFromMongo';
import { retrieveBookFromGoodreadsReducer } from './retrieveBookFromGoodreads';
import { swipeHistoryReducer } from './swipeHistory';

export default combineReducers(
    {
        auth: authReducer,
        searchResults: bookSearchReducer,
        selectedBook: selectedBookReducer,
        myBooks: myBooksReducer,
        myMatches: myMatchesReducer,
        books: booksReducer,
        recentlyAdded: recentlyAddedRedcuer,
        selectedBookFromDB: selectBookFromMongoReducer,
        selectedBookFromSearch: retrieveBookFromGoodreadsReducer,
        swipeHistory: swipeHistoryReducer
    }
);