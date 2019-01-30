import Axios from 'axios';

import {
    UPDATE_MY_SHELF,
    SELECT_BOOK_FROM_DB,
    UPDATE_SEARCH_RESULTS
 } from './types';

const INTRO_SEARCH_LIMIT = 5;
const DEFAULT_SEARCH_LIMIT = 10;

export const updateMyShelf = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myShelf');

            dispatch( {
                type: UPDATE_MY_SHELF,
                payload: res.data.myShelf.reverse() || []
            });
        } catch(error) {
            console.log('/api/myShelf failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_SHELF,
                payload: { error: error.response.data.error } 
            });
        }
    };

export const searchGoodreads = (query, intro) =>
    async (dispatch) => {
        const searchData =  {
            query,
            limit: ( intro ? INTRO_SEARCH_LIMIT : DEFAULT_SEARCH_LIMIT )
        };

        dispatch( {
            type: UPDATE_SEARCH_RESULTS,
            payload: null
        });

        try {
            const res = await Axios.post('/api/books/search', searchData);

            dispatch( {
                type: UPDATE_SEARCH_RESULTS,
                payload: res.data.books || false
            });
        } catch(error) {
            console.log('POST /api/books/search failed with error: ' + error);
        }
    };

export const updateSearchResults = (searchResults) => {
    return {
        type: UPDATE_SEARCH_RESULTS,
        payload: searchResults || []
    };
};

export const postReview = (bookID, review) => 
    async (dispatch) => {
        const reviewData = {
            bookID,
            review
        };

        try {
            const resReview = await Axios.post('/api/review', reviewData);
    
            if (resReview.data.saved) {
                const resBook = await Axios.get(`/api/books/${bookID}`);
    
                dispatch( {
                    type: SELECT_BOOK_FROM_DB,
                    payload: resBook.data.book || null
                });
            }
        } catch (error) {
            console.log('POST /api/review failed with error: ' + error);
        }
    };
