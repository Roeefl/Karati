import { UPDATE_MY_MATCHES, MATCHES_USER_SELECTED } from '../actions/types';

export const myMatchesReducer = (myMatches = false, action) => {
  if (action.type === UPDATE_MY_MATCHES) {
    return action.payload;
  }

  return myMatches;
};

export const matchesWithUserReducer = (user = false, action) => {
  if (action.type === MATCHES_USER_SELECTED) {
    return action.payload;
  }

  return user;
};
