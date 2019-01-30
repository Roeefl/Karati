import {
    BOOK_SELECTED,
 } from './types';

 export const selectBookFromBrowsing = (bookData) => {
    return {
        type: BOOK_SELECTED,
        payload: bookData
    };
};
