import { UPDATE_MY_PROPOSALS } from '../actions/types';

export const myProposalsReducer = (myProposals = false, action) => {
    if (action.type === UPDATE_MY_PROPOSALS) {
        return action.payload;
    }

    return myProposals;
};