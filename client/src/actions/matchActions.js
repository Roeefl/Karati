import Axios from 'axios';

import { MATCHES_USER_SELECTED, UPDATE_MY_MATCHES } from './types';

export const selectUserToShowMatchesWith = user => {
  // Returns an Action
  return {
    type: MATCHES_USER_SELECTED,
    payload: user
  };
};

export const fetchMyMatches = () => async dispatch => {
  try {
    const res = await Axios.get('/api/myMatches');

    dispatch({
      type: UPDATE_MY_MATCHES,
      payload: res.data.myMatches || []
    });
  } catch (error) {
    console.log('/api/myMatches failed with error: ' + error);

    dispatch({
      type: UPDATE_MY_MATCHES,
      payload: { error: error.response.data.error }
    });
  }
};
