import { UPDATE_FEEDS } from '../actions/types';

export const feedsReducer = (recentlyAdded = false, action) => {
    if (action.type === UPDATE_FEEDS) {
        return action.payload || {};
    }

    return recentlyAdded;
};