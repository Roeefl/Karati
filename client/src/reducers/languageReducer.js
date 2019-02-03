import { SWAP_LANGUAGE } from '../actions/types';
import { DEFAULT, SECONDARY } from '../locale';

export const languageReducer = (language = DEFAULT, action) => {
    if (action.type === SWAP_LANGUAGE) {
        return (language === DEFAULT ? SECONDARY : DEFAULT);
    }

    return language;
};