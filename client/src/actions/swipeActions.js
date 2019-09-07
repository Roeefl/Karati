import Axios from 'axios';

import {
  UPDATE_AVAILABLE_SWIPES,
  UPDATE_MY_SWIPE_HISTORY,
  FETCH_USER
} from './types';

export const updateAvailableSwipes = () => async dispatch => {
  try {
    const res = await Axios.get('/api/availableSwipes');

    dispatch({
      type: UPDATE_AVAILABLE_SWIPES,
      payload: res.data.availableSwipes || []
    });
  } catch (error) {
    console.log('/api/books failed with error: ' + error);

    dispatch({
      type: UPDATE_AVAILABLE_SWIPES,
      payload: false
    });
  }
};

export const swipeBook = (
  liked,
  bookID,
  ownerID,
  myUserID
) => async dispatch => {
  const swipeData = {
    bookID,
    ownerID,
    myUserID
  };

  const swipeURL = '/api/swipe/' + (liked ? 'liked' : 'rejected');
  try {
    const res = await Axios.put(swipeURL, swipeData);

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('PUT /api/swipe failed with error: ');
    console.log(error);
  }

  try {
    const resBooks = await Axios.get('/api/availableSwipes');

    dispatch({
      type: UPDATE_AVAILABLE_SWIPES,
      payload: resBooks.data.availableSwipes || []
    });
  } catch (error) {
    console.log('/api/books failed with error: ' + error);

    dispatch({
      type: UPDATE_AVAILABLE_SWIPES,
      payload: false
    });
  }
};

export const fetchMySwipeHistory = () => async dispatch => {
  try {
    const res = await Axios.get('/api/mySwipeHistory');

    dispatch({
      type: UPDATE_MY_SWIPE_HISTORY,
      payload: res.data.mySwipeHistory || []
    });
  } catch (error) {
    console.log('/api/mySwipeHistory failed with error: ' + error);

    dispatch({
      type: UPDATE_MY_SWIPE_HISTORY,
      payload: false
    });
  }
};
