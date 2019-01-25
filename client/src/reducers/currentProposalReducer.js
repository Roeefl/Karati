import { UPDATE_CURRENT_PROPOSAL } from '../actions/types';

export const currentProposalReducer = (currentProposal = false, action) => {
    if (action.type === UPDATE_CURRENT_PROPOSAL) {
        console.log(action.payload);
        return action.payload;
    }

    return currentProposal;
};