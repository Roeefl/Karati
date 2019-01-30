import { UPDATE_MY_SHELF } from '../actions/types';

export const myShelfReducer = (myBooks = false, action) => {
    if (action.type === UPDATE_MY_SHELF) {
        return action.payload;
    }

    return myBooks;
};