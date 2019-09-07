import { OWNER_INFO } from '../actions/types';

export const ownerInfoReducer = (ownerInfo = null, action) => {
  if (action.type === OWNER_INFO) {
    return action.payload || false;
  }

  return ownerInfo;
};
