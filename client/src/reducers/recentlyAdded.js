import { UPDATE_RECENTLY_ADDED } from '../actions/types';

export const recentlyAddedRedcuer = (recentlyAdded = false, action) => {
    if (action.type === UPDATE_RECENTLY_ADDED) {
        return action.payload || [];
    }

    return recentlyAdded;
};