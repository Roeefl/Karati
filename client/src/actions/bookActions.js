import Axios from 'axios';

import {
    SELECT_BOOK_FROM_DB,
    RETRIEVE_BOOK_FROM_GOODREADS
 } from './types';

export const selectBookFromDB = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.get(`/api/books/${bookID}`);
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

export const resetBookFromDB = () => {
    return {
        type: SELECT_BOOK_FROM_DB,
        payload: false
    }
};

export const retrieveBookFromGoodreads = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.post('/api/myShelf/search/book/' + bookID);
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

export const resetBookFromGoodreads = () => {
    return {
        type: RETRIEVE_BOOK_FROM_GOODREADS,
        payload: false
    }
};
