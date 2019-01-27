import { SETUP_PUSHER } from '../actions/types';

import Pusher from 'pusher-js';
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true; 

const PUSHER_APP_ID = '300a43dcc40b1a52fa00';

export const pusherReducer = (pusher = null, action) => {
    if (action.type === SETUP_PUSHER) {
        return new Pusher(PUSHER_APP_ID, {
            cluster: 'eu',
            forceTLS: true
        });
    }

    return pusher;
};