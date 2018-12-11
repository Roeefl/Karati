import { combineReducers } from 'redux';
import { authReducer } from  './authReducer';
import { UPDATE_SEARCH_RESULTS, BOOK_SELECTED, UPDATE_MY_BOOKS, UPDATE_MATCH_RESULTS, UPDATE_MY_MATCHES } from '../actions/types';

const bookSearchResultsReducer = (searchResults = [], action) => {
    if (action.type === UPDATE_SEARCH_RESULTS) {
        return action.payload;
    }

    return searchResults;
};

const selectedBookReducer = (selectedBook = null, action) => {
    if (action.type === BOOK_SELECTED) {
        return action.payload;
    }

    return selectedBook;
};

const myBooksReducer = (myBooks = [], action) => {
    if (action.type === UPDATE_MY_BOOKS) {
        return action.payload;
    }

    return myBooks;
};

const myMatchesReducer = (myMatches = [], action) => {
    if (action.type === UPDATE_MY_MATCHES) {
        return action.payload;
    }

    return myMatches;
};


const matchResultsReducer = (matchResults = [], action) => {
    if (action.type === UPDATE_MATCH_RESULTS) {
        return action.payload;
    }

    return matchResults;
};

export default combineReducers(
    {
        auth: authReducer,
        searchResults: bookSearchResultsReducer,
        selectedBook: selectedBookReducer,
        myBooks: myBooksReducer,
        myMatches: myMatchesReducer,
        matchResults: matchResultsReducer
    }
);