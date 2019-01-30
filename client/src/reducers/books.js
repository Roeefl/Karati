import { UPDATE_AVAILABLE_SWIPES } from '../actions/types';

export const booksReducer = (books = false, action) => {
    if (action.type === UPDATE_AVAILABLE_SWIPES) {
        return action.payload || [];
    }

    return books;
};