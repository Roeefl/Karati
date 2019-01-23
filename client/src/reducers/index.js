import { combineReducers } from 'redux';

import { reducer as reduxForm } from 'redux-form';

import { userDataReducer } from  './userData';
import { selectedBookFromBrowseReducer } from  './selectedBookFromBrowse';
import { bookSearchReducer } from './bookSearch';
import { myShelfReducer } from './myShelf';
import { feedsReducer } from './feeds';
import { booksReducer } from './books';
import { myMatchesReducer } from './myMatches';
import { myProposalsReducer } from './myProposals';
import { selectBookFromMongoReducer } from './selectBookFromMongo';
import { retrieveBookFromGoodreadsReducer } from './retrieveBookFromGoodreads';
import { swipeHistoryReducer } from './swipeHistory';
import { matchesWithUserReducer } from './matchesWithUser';
import { currentComponentReducer } from './currentComponent';
import { swapJustProposedReducer } from './swapJustProposed';

export default combineReducers(
    {
        form: reduxForm,
        userData: userDataReducer,
        searchResults: bookSearchReducer,
        selectedBookFromBrowse: selectedBookFromBrowseReducer,
        myBooks: myShelfReducer,
        myMatches: myMatchesReducer,
        myProposals: myProposalsReducer,
        books: booksReducer,
        feeds: feedsReducer,
        selectedBookFromDB: selectBookFromMongoReducer,
        selectedBookFromSearch: retrieveBookFromGoodreadsReducer,
        swipeHistory: swipeHistoryReducer,
        matchesWithUser: matchesWithUserReducer,
        currentComponent: currentComponentReducer,
        proposedSwap: swapJustProposedReducer
    }
);