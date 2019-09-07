import Axios from 'axios';

import {
  SETUP_PUSHER,
  SETUP_SENTRY,
  LOAD_GENRES,
  UPDATE_FEEDS,
  SET_CURRENT_COMP
} from './types';

export const setCurrentComponent = compInfo => {
  return {
    type: SET_CURRENT_COMP,
    payload: compInfo
  };
};

export const setupPusher = () => {
  return {
    type: SETUP_PUSHER,
    payload: true
  };
};

export const setupSentry = () => {
  return {
    type: SETUP_SENTRY,
    payload: true
  };
};

export const loadGenres = () => async dispatch => {
  try {
    const resGenres = await Axios.get('/api/genres');

    dispatch({
      type: LOAD_GENRES,
      payload: resGenres.data.genres || []
    });
  } catch (error) {
    console.log('GET /api/genres failed with error: ' + error);
  }
};

export const updateFeeds = () => async dispatch => {
  try {
    const recent = await Axios.get('/api/recent');
    const mostPopular = await Axios.get('/api/mostPopular');

    const feeds = {
      recentlyAdded: recent.data.recentlyAdded,
      mostPopular: mostPopular.data.mostPopular
    };

    dispatch({
      type: UPDATE_FEEDS,
      payload: feeds || {}
    });
  } catch (error) {
    console.log('/api/recent failed with error: ' + error);

    dispatch({
      type: UPDATE_FEEDS,
      payload: false
    });
  }
};
