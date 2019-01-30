import { SETUP_SENTRY } from '../actions/types';

import * as Sentry from '@sentry/browser';

const dsn = "https://9d4417614d394837a20fdcff7a27ba9d@sentry.io/1352349";

export const sentryReducer = (sentry = false, action) => {
    if (action.type === SETUP_SENTRY) {
        Sentry.init({
            dsn
        });

        return true;
    }

    return sentry;
};