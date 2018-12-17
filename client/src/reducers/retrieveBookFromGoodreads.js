import { RETRIEVE_BOOK_FROM_GOODREADS } from '../actions/types';

export const retrieveBookFromGoodreadsReducer = (book = false, action) => {
    if (action.type === RETRIEVE_BOOK_FROM_GOODREADS) {
        return action.payload;
    }

    return book;
};