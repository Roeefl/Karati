import Axios from 'axios';
import { UPDATE_SEARCH_RESULTS, BOOK_SELECTED, FETCH_USER, UPDATE_MY_BOOKS } from './types';

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
        const res = await Axios.get('/api/currentUser');

        dispatch( {
            type: FETCH_USER,
            payload: res.data || null
        });
    };

export const updateMyBooks = (myBooks) => {
    return {
        type: UPDATE_MY_BOOKS,
        payload: myBooks
    }
}