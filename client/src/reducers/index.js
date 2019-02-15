import { combineReducers } from 'redux';

import { reducer as reduxForm } from 'redux-form';

import { languageReducer } from './languageReducer';
import { userDataReducer } from  './userData';
import { ownerInfoReducer } from './ownerInfo';
import { myShelfReducer } from './myShelf';
import { feedsReducer } from './feeds';

import {
    booksReducer,
    retrieveBookFromGoodreadsReducer,
    selectedBookFromBrowseReducer,
    selectBookFromMongoReducer,
    bookSearchReducer
} from './books';

import {
    myMatchesReducer,
    matchesWithUserReducer
} from './matches';

import {
    myProposalsReducer,
    currentProposalReducer
} from './proposals';

import { swipeHistoryReducer } from './swipeHistory';
import { currentComponentReducer } from './currentComponent';
import { swapJustProposedReducer } from './swapJustProposed';
import { pusherReducer } from './pusherReducer';
import { sentryReducer } from './sentryReducer';
import { genresReducer } from './genresReducer';

export default combineReducers(
    {
        language: languageReducer,
        pusher: pusherReducer,
        sentry: sentryReducer,
        genres: genresReducer,
        form: reduxForm,
        userData: userDataReducer,
        ownerInfo: ownerInfoReducer,
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
        proposedSwap: swapJustProposedReducer,
        currentProposal: currentProposalReducer
    }
);