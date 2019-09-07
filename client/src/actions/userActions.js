import Axios from 'axios';

import { FETCH_USER, OWNER_INFO, SWAP_LANGUAGE } from './types';

export const swapLanguage = () => {
  return {
    type: SWAP_LANGUAGE,
    payload: true
  };
};

export const fetchUser = () => async dispatch => {
  try {
    const res = await Axios.get('/api/currentUser');

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('Failed to fetchUser ' + error);

    dispatch({
      type: FETCH_USER,
      payload: { error: error.response.data.error }
    });
  }
};

export const getUserDataById = userId => async dispatch => {
  try {
    const res = await Axios.get(`/api/users/${userId}`);

    dispatch({
      type: OWNER_INFO,
      payload: res.data.user || null
    });
  } catch (error) {
    console.log('Failed to fetchUser ' + error);

    dispatch({
      type: OWNER_INFO,
      payload: { error: error.response.data.error }
    });
  }
};

export const submitProfileForm = (formValues, history) => async dispatch => {
  // console.log(history);
  try {
    const res = await Axios.post('/api/myProfile', {
      first: formValues.first,
      last: formValues.last,
      username: formValues.username,
      bio: formValues.bio
    });

    if (res.data.error) {
      console.log('BAD USERNAME, CHOOSE ANOTHER.');
      history.push('/');
    }

    if (!res.data.currUser) {
      return;
    }

    history.push('/');

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('Error on submitProfileForm ' + error);

    dispatch({
      type: FETCH_USER,
      payload: false
    });
  }
};

export const updateUserSettings = userSettings => async dispatch => {
  try {
    const res = await Axios.post('/api/mySettings', {
      settings: userSettings
    });

    if (res.data.error) {
      console.log('Failed to save settings.');
    }

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('/api/recent failed with error: ' + error);

    dispatch({
      type: FETCH_USER,
      payload: false
    });
  }
};

export const markNotificationAsSeen = (
  userId,
  notificationId
) => async dispatch => {
  try {
    const res = await Axios.put(
      `/api/user/${userId}/notification/${notificationId}/seen`
    );

    if (res.data.error) {
      console.log('Failed to save settings.');
    }

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('/api/recent failed with error: ' + error);

    dispatch({
      type: FETCH_USER,
      payload: false
    });
  }
};

export const clearNotifications = userId => async dispatch => {
  try {
    const res = await Axios.put(`/api/user/${userId}/notification/clear`);

    if (res.data.error) {
      console.log('Failed to save settings.');
    }

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('clearNotifications failed with error: ' + error);

    dispatch({
      type: FETCH_USER,
      payload: false
    });
  }
};

function getGeolocation(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export const setupUserGeolocation = () => async dispatch => {
  try {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const { coords } = await getGeolocation(options);
    console.log(coords);

    const { latitude, longitude } = coords;

    const locData = {
      lat: latitude,
      lng: longitude
    };

    const res = await Axios.put('/api/myLocation', locData);

    // const res = await Axios.get('/api/location', {
    //     params: {
    //         latitude,
    //         longitude
    //     }
    // });

    if (res.data.error) {
      console.log('Failed: GET /api/location');
    }

    dispatch({
      type: FETCH_USER,
      payload: res.data.currUser || null
    });
  } catch (error) {
    console.log('setupUserGeolocation failed with error: ' + error);
  }
};
