import { BOOK_SELECTED } from '../actions/types';

export const selectedBookFromBrowseReducer = (selectedBook = null, action) => {
    if (action.type === BOOK_SELECTED) {
        return action.payload;
    }

    return selectedBook;
};