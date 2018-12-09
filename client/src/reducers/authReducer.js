import { FETCH_USER } from '../actions/types';

export const authReducer = (auth = null, action) => {
    if (action.type === FETCH_USER) {
        return action.payload || false;
    }

    return auth;
};