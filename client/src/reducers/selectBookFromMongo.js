import { SELECT_BOOK_FROM_DB } from '../actions/types';

export const selectBookFromMongoReducer = (book = false, action) => {
    if (action.type === SELECT_BOOK_FROM_DB) {
        return action.payload;
    }

    return book;
};