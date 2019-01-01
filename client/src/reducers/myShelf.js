import { UPDATE_MY_BOOKS } from '../actions/types';

export const myShelfReducer = (myBooks = false, action) => {
    if (action.type === UPDATE_MY_BOOKS) {
        return action.payload;
    }

    return myBooks;
};