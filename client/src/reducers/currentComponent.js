import { SET_CURRENT_COMP } from '../actions/types';

export const currentComponentReducer = (compInfo = {}, action) => {
    if (action.type === SET_CURRENT_COMP) {
        return action.payload;
    }

    return compInfo;
};