import Axios from 'axios';
import { UPDATE_SEARCH_RESULTS,
    BOOK_SELECTED,
    FETCH_USER,
    UPDATE_MY_BOOKS,
    UPDATE_BOOKS,
    UPDATE_MY_MATCHES,
    UPDATE_RECENTLY_ADDED,
    SELECT_BOOK_FROM_DB,
    RETRIEVE_BOOK_FROM_GOODREADS,
    UPDATE_MY_SWIPE_HISTORY    } from './types';

// Action Creator
export const selectBook = (bookData) => {
    // Returns an Action
    return {
        type: BOOK_SELECTED,
        payload: bookData
    };
};

export const resetBookFromDB = () => {
    return {
        type: SELECT_BOOK_FROM_DB,
        payload: false
    }
};


export const resetBookFromGoodreads = () => {
    return {
        type: RETRIEVE_BOOK_FROM_GOODREADS,
        payload: false
    }
};

export const selectBookFromDB = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.get('/api/books/' + bookID);
            console.log(res.data.book);

            dispatch( {
                type: SELECT_BOOK_FROM_DB,
                payload: res.data.book || null
            });
        } catch(error) {
            console.log('Error on selectBookFromDB ' + error);

            dispatch( {
                type: SELECT_BOOK_FROM_DB,
                payload: false
            });
        }
    };

export const retrieveBookFromGoodreads = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.get('/api/myShelf/search/book/' + bookID);
            console.log(res.data.book);

            dispatch( {
                type: RETRIEVE_BOOK_FROM_GOODREADS,
                payload: res.data.book || null
            });
        } catch(error) {
            console.log('Error on retrieveBookFromGoodreads ' + error);

            dispatch( {
                type: RETRIEVE_BOOK_FROM_GOODREADS,
                payload: false
            });
        }
    };

export const updateSearchResults = (searchResults) => {
    // Returns an Action
    return {
        type: UPDATE_SEARCH_RESULTS,
        payload: searchResults || []
    };
};

export const fetchUser = () => 
    async (dispatch) => { 
        try {
            const res = await Axios.get('/api/currentUser');

            dispatch( {
                type: FETCH_USER,
                payload: res.data || null
            });
        } catch(error) {
            console.log('Failed to fetchUser ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: null
            });
        }
    };

export const updateMyShelf = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myShelf');

            dispatch( {
                type: UPDATE_MY_BOOKS,
                payload: res.data.myShelf || []
            });
        } catch(error) {
            console.log('/api/myShelf failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_BOOKS,
                payload: false
            });
        }
    };

export const fetchMyMatches = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myMatches');

            dispatch( {
                type: UPDATE_MY_MATCHES,
                payload: res.data.myMatches || []
            });
        } catch(error) {
            console.log('/api/myMatches failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_MATCHES,
                payload: false
            });
        }
    };

export const fetchMySwipeHistory = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/mySwipeHistory');

            dispatch( {
                type: UPDATE_MY_SWIPE_HISTORY,
                payload: res.data.mySwipeHistory || []
            });
        } catch(error) {
            console.log('/api/mySwipeHistory failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_SWIPE_HISTORY,
                payload: false
            });
        }
    };

export const updateBooks = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/books');

            dispatch( {
                type: UPDATE_BOOKS,
                payload: res.data.books || []
            });
        } catch(error) {
            console.log('/api/books failed with error: ' + error);

            dispatch( {
                type: UPDATE_BOOKS,
                payload: false
            });
        }
    };

export const updateRecentlyAdded = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/recent');
    
            dispatch( {
                type: UPDATE_RECENTLY_ADDED,
                payload: res.data.recentlyAdded || []
            });
        } catch(error) {
            console.log('/api/recent failed with error: ' + error);
    
            dispatch( {
                type: UPDATE_RECENTLY_ADDED,
                payload: false
            });
        }
    };