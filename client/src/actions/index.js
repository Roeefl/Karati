import Axios from 'axios';
import { UPDATE_SEARCH_RESULTS, BOOK_SELECTED, FETCH_USER, UPDATE_MY_BOOKS, UPDATE_MATCH_RESULTS, UPDATE_MY_MATCHES } from './types';

// Action Creator
export const selectBook = (bookData) => {
    // Returns an Action
    return {
        type: BOOK_SELECTED,
        payload: bookData
    };
};

export const updateSearchResults = (searchResults) => {
    // Returns an Action
    return {
        type: UPDATE_SEARCH_RESULTS,
        payload: searchResults
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

export const updateMyBooks = (myBooks) => {
    return {
        type: UPDATE_MY_BOOKS,
        payload: myBooks
    }
};

export const updateMyMatches = (myMatches) => {
    return {
        type: UPDATE_MY_MATCHES,
        payload: myMatches
    }
};

export const updateMatchResults = (matchResults) => {
    return {
        type: UPDATE_MATCH_RESULTS,
        payload: matchResults
    }
};