import Axios from 'axios';
import { UPDATE_SEARCH_RESULTS, BOOK_SELECTED, FETCH_USER } from './types';

// Action Creator
export const selectBook = (book) => {
    // Returns an Action
    return {
        type: BOOK_SELECTED,
        payload: book
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