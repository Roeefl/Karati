import Axios from 'axios';
import { SHOW_BOOK, UPDATE_SEARCH_RESULTS, BOOK_SELECTED, FETCH_USER, UPDATE_MY_BOOKS, UPDATE_BOOKS, UPDATE_MY_MATCHES, UPDATE_RECENTLY_ADDED } from './types';

// Action Creator
export const selectBook = (bookData) => {
    // Returns an Action
    return {
        type: BOOK_SELECTED,
        payload: bookData
    };
};

export const showBook = (bookId) => 
    async (dispatch) => { 
        try {
            const res = await Axios.get('/api/books/' + bookId);

            dispatch( {
                type: SHOW_BOOK,
                payload: res.data.book || {}
            });
        } catch(error) {
            console.log('Failed to fetchUser ' + error);

            dispatch( {
                type: SHOW_BOOK,
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