import { PROPOSE_SWAP } from '../actions/types';

export const swapJustProposedReducer = (swapProposed = null, action) => {
    if (action.type === PROPOSE_SWAP) {
        return action.payload;
    }

    return swapProposed;
};