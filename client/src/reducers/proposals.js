import {
    UPDATE_MY_PROPOSALS,
    UPDATE_CURRENT_PROPOSAL
 } from '../actions/types';

export const myProposalsReducer = (myProposals = false, action) => {
    if (action.type === UPDATE_MY_PROPOSALS) {
        return action.payload;
    }

    return myProposals;
};

export const currentProposalReducer = (currentProposal = false, action) => {
    if (action.type === UPDATE_CURRENT_PROPOSAL) {
        return action.payload;
    }

    return currentProposal;
};
