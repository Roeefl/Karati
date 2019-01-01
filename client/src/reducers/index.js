import { combineReducers } from 'redux';

import { reducer as reduxForm } from 'redux-form';

import { userDataReducer } from  './userData';
import { selectedBookReducer } from  './selectedBook';
import { bookSearchReducer } from './bookSearch';
import { myShelfReducer } from './myShelf';
import { feedsReducer } from './feeds';
import { booksReducer } from './books';
import { myMatchesReducer } from './myMatches';
import { selectBookFromMongoReducer } from './selectBookFromMongo';
import { retrieveBookFromGoodreadsReducer } from './retrieveBookFromGoodreads';
import { swipeHistoryReducer } from './swipeHistory';
import { matchesWithUserReducer } from './matchesWithUser';
import { currentComponentReducer } from './currentComponent';

export default combineReducers(
    {
        form: reduxForm,
        userData: userDataReducer,
        searchResults: bookSearchReducer,
        selectedBook: selectedBookReducer,
        myBooks: myShelfReducer,
        myMatches: myMatchesReducer,
        books: booksReducer,
        feeds: feedsReducer,
        selectedBookFromDB: selectBookFromMongoReducer,
        selectedBookFromSearch: retrieveBookFromGoodreadsReducer,
        swipeHistory: swipeHistoryReducer,
        matchesWithUser: matchesWithUserReducer,
        currentComponent: currentComponentReducer
    }
);