import { UPDATE_BOOKS } from '../actions/types';

export const booksReducer = (books = false, action) => {
    if (action.type === UPDATE_BOOKS) {
        return action.payload || [];
    }

    return books;
};