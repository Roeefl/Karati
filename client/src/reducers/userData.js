import { FETCH_USER } from '../actions/types';

export const userDataReducer = (userData = null, action) => {
    if (action.type === FETCH_USER) {
        return action.payload || false;
    }

    return userData;
};