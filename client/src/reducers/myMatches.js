import { UPDATE_MY_MATCHES } from '../actions/types';

export const myMatchesReducer = (myMatches = false, action) => {
    if (action.type === UPDATE_MY_MATCHES) {
        return action.payload;
    }

    return myMatches;
};