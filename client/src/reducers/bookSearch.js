import { UPDATE_SEARCH_RESULTS } from '../actions/types';

export const bookSearchReducer = (searchResults = false, action) => {
    if (action.type === UPDATE_SEARCH_RESULTS) {
        return action.payload;
    }

    return searchResults;
};