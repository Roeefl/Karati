import { MATCHES_USER_SELECTED } from '../actions/types';

export const matchesWithUserReducer = (user = false, action) => {
    if (action.type === MATCHES_USER_SELECTED) {
        return action.payload;
    }

    return user;
};