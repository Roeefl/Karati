import { LOAD_GENRES } from '../actions/types';

export const genresReducer = (genres = [], action) => {
    if (action.type === LOAD_GENRES) {
        return action.payload;
    }

    return genres;
};