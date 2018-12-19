import { UPDATE_MY_SWIPE_HISTORY } from '../actions/types';

export const swipeHistoryReducer = (swipeHistory = false, action) => {
    if (action.type === UPDATE_MY_SWIPE_HISTORY) {
        return action.payload;
    }

    return swipeHistory;
};