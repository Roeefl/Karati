import { SHOW_BOOK } from '../actions/types';

export const showBookReducer = (book = null, action) => {
    if (action.type === SHOW_BOOK) {
        return action.payload;
    }

    return book;
};