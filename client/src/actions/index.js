import Axios from 'axios';

import { UPDATE_SEARCH_RESULTS,
    BOOK_SELECTED,
    FETCH_USER,
    UPDATE_MY_BOOKS,
    UPDATE_BOOKS,
    UPDATE_MY_MATCHES,
    UPDATE_MY_PROPOSALS,
    UPDATE_FEEDS,
    SELECT_BOOK_FROM_DB,
    RETRIEVE_BOOK_FROM_GOODREADS,
    UPDATE_MY_SWIPE_HISTORY,
    SET_CURRENT_COMP,
    MATCHES_USER_SELECTED,
    PROPOSE_SWAP,
    UPDATE_CURRENT_PROPOSAL
 } from './types';

export const submitProfileForm = (formValues, history) =>
    async (dispatch) => { 
        // console.log(history);
        try {
            const res = await Axios.post('/api/myProfile', {
                first: formValues.first,
                last: formValues.last,
                username: formValues.username,
                bio: formValues.bio
            } );

            if (res.data.error) {
                console.log('BAD USERNAME, CHOOSE ANOTHER.');
                history.push('/');
            }

            if (!res.data.currUser) {
                return;
            }

            history.push('/');

            dispatch( {
                type: FETCH_USER,
                payload: res.data.currUser || null
            });
        } catch(error) {
            console.log('Error on submitProfileForm ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: false
            });
        }
    };

// Action Creator
export const selectBookFromBrowsing = (bookData) => {
    // Returns an Action
    return {
        type: BOOK_SELECTED,
        payload: bookData
    };
};

export const selectUserToShowMatchesWith = (user) => {
    // Returns an Action
    return {
        type: MATCHES_USER_SELECTED,
        payload: user
    };
};

export const resetBookFromDB = () => {
    return {
        type: SELECT_BOOK_FROM_DB,
        payload: false
    }
};

export const resetBookFromGoodreads = () => {
    return {
        type: RETRIEVE_BOOK_FROM_GOODREADS,
        payload: false
    }
};

export const setCurrentComponent = (compInfo) => {
    return {
        type: SET_CURRENT_COMP,
        payload: compInfo
    }
};

export const selectBookFromDB = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.get(`/api/books/${bookID}`);
            console.log(res.data.book);

            dispatch( {
                type: SELECT_BOOK_FROM_DB,
                payload: res.data.book || null
            });
        } catch(error) {
            console.log('Error on selectBookFromDB ' + error);

            dispatch( {
                type: SELECT_BOOK_FROM_DB,
                payload: false
            });
        }
    };

export const retrieveBookFromGoodreads = (bookID) => 
    async (dispatch) => { 
        try {
            const res = await Axios.post('/api/myShelf/search/book/' + bookID);
            console.log(res.data.book);

            dispatch( {
                type: RETRIEVE_BOOK_FROM_GOODREADS,
                payload: res.data.book || null
            });
        } catch(error) {
            console.log('Error on retrieveBookFromGoodreads ' + error);

            dispatch( {
                type: RETRIEVE_BOOK_FROM_GOODREADS,
                payload: false
            });
        }
    };

export const updateSearchResults = (searchResults) => {
    // Returns an Action
    return {
        type: UPDATE_SEARCH_RESULTS,
        payload: searchResults || []
    };
};

export const setCurrentProposal = (proposal) => {
    return {
        type: UPDATE_CURRENT_PROPOSAL,
        payload: proposal || null
    }
};

export const reloadProposal = (proposalId) =>
    async (dispatch) => { 
        try {
            const res = await Axios.get(`/api/proposal/${proposalId}`);

            dispatch( {
                type: UPDATE_CURRENT_PROPOSAL,
                payload: res.data.proposal || null
            });
        } catch(error) {
            console.log(`Failed to refreshChat with error ${error}`);

            dispatch( {
                type: UPDATE_CURRENT_PROPOSAL,
                payload: { error: error.response.data.error }
            });
        }
    };

export const sendChatMessage = (matchId, senderId, message) => 
    async (dispatch) => {
        try {
            const chatData = {
                matchId,
                senderId,
                message
            };

            const res = await Axios.post('/api/proposal/chat', chatData);

            if (res.data.error) {
                console.log('Failed: POST /api/proposal/chat');
            }

            // console.log('dispatching UPDATE_CURRENT_PROPOSAL with chat:');
            // console.log(res.data.proposal);

            dispatch({
                type: UPDATE_CURRENT_PROPOSAL,
                payload: res.data.proposal || null
            });
        } catch (error) {
            console.log('POST /api/proposal/chat failed with error: ' + error);
        }
    };

export const fetchUser = () => 
    async (dispatch) => { 
        try {
            const res = await Axios.get('/api/currentUser');

            dispatch( {
                type: FETCH_USER,
                payload: res.data.currUser || null
            });
        } catch(error) {
            console.log('Failed to fetchUser ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: { error: error.response.data.error }
            });
        }
    };

export const updateMyShelf = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myShelf');

            dispatch( {
                type: UPDATE_MY_BOOKS,
                payload: res.data.myShelf.reverse() || []
            });
        } catch(error) {
            console.log('/api/myShelf failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_BOOKS,
                payload: { error: error.response.data.error } 
            });
        }
    };

export const fetchMyMatches = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myMatches');

            dispatch( {
                type: UPDATE_MY_MATCHES,
                payload: res.data.myMatches || []
            });
        } catch(error) {
            console.log('/api/myMatches failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_MATCHES,
                payload: { error: error.response.data.error }
            });
        }
    };

export const fetchMyProposals = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/myProposals');

            dispatch( {
                type: UPDATE_MY_PROPOSALS,
                payload: res.data.myProposals || []
            });
        } catch(error) {
            console.log('/api/myProposals failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_PROPOSALS,
                payload: { error: error.response.data.error }
            });
        }
    };
    
export const fetchMySwipeHistory = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/mySwipeHistory');

            dispatch( {
                type: UPDATE_MY_SWIPE_HISTORY,
                payload: res.data.mySwipeHistory || []
            });
        } catch(error) {
            console.log('/api/mySwipeHistory failed with error: ' + error);

            dispatch( {
                type: UPDATE_MY_SWIPE_HISTORY,
                payload: false
            });
        }
    };

export const updateBooks = () =>
    async (dispatch) => {
        try {
            const res = await Axios.get('/api/availableSwipes');

            dispatch( {
                type: UPDATE_BOOKS,
                payload: res.data.availableSwipes || []
            });
        } catch(error) {
            console.log('/api/books failed with error: ' + error);

            dispatch( {
                type: UPDATE_BOOKS,
                payload: false
            });
        }
    };

export const updateFeeds = () =>
    async (dispatch) => {
        try {
            const recent = await Axios.get('/api/recent');
            const mostPopular = await Axios.get('/api/mostPopular');

            const feeds = {
                recentlyAdded: recent.data.recentlyAdded,
                mostPopular: mostPopular.data.mostPopular
            };
    
            dispatch( {
                type: UPDATE_FEEDS,
                payload: feeds || {}
            });
        } catch(error) {
            console.log('/api/recent failed with error: ' + error);
    
            dispatch( {
                type: UPDATE_FEEDS,
                payload: false
            });
        }
    };
    
export const updateUserSettings = (userSettings) =>
    async (dispatch) => {
        try {
            const res = await Axios.post('/api/mySettings', 
            {
                settings: userSettings
            });

            if (res.data.error) {
                console.log('Failed to save settings.');
            }

            dispatch( {
                type: FETCH_USER,
                payload: res.data.currUser || null
            });
        } catch(error) {
            console.log('/api/recent failed with error: ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: false
            });
        }
    };

export const markNotificationAsSeen = (userId, notificationId) =>
    async (dispatch) => {
        try {           
            const res = await Axios.put(`/api/user/${userId}/notification/${notificationId}/seen`);

            if (res.data.error) {
                console.log('Failed to save settings.');
            }

            dispatch( {
                type: FETCH_USER,
                payload: res.data.currUser || null
            });
        } catch(error) {
            console.log('/api/recent failed with error: ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: false
            });
        }
    };

export const clearNotifications = (userId) =>
    async (dispatch) => {
        try {           
            const res = await Axios.put(`/api/user/${userId}/notification/clear`);

            if (res.data.error) {
                console.log('Failed to save settings.');
            }

            dispatch( {
                type: FETCH_USER,
                payload: res.data.currUser || null
            });
        } catch(error) {
            console.log('clearNotifications failed with error: ' + error);

            dispatch( {
                type: FETCH_USER,
                payload: false
            });
        }
    };

export const proposeSwap = (firstUserId, secondUserId, firstBookId, secondBookId, reset = false) => 
    async (dispatch) => {
        if (reset) {
            dispatch( {
                type: PROPOSE_SWAP,
                payload: null
            });

            dispatch({
                type: UPDATE_MY_MATCHES,
                payload: null
            });

            return;
        }

        try {           
            const matchData = {
                firstUserId,
                secondUserId,
                firstBookId,
                secondBookId
            };

            console.log(matchData);

            const res = await Axios.put('/api/match/propose', matchData);

            if (res.data.error) {
                console.log('Failed: propose swap');
            }

            dispatch( {
                type: PROPOSE_SWAP,
                payload: res.data.match || null
                // payload: null
            });
        } catch(error) {
            console.log('/api/match/propose failed with error: ' + error);

            dispatch( {
                type: PROPOSE_SWAP,
                payload: false
            });
        }
    };

export const acceptProposal = (matchId) =>
    async (dispatch) => {
        try {
            const matchData = {
                matchId
            };

            const res = await Axios.put('/api/match/accept', matchData);

            if (res.data.error) {
                console.log('Failed: /match/accept');
            }

            const proposals = await Axios.get('/api/myProposals');

            dispatch({
                type: UPDATE_MY_PROPOSALS,
                payload: proposals.data.myProposals || []
            });
        } catch (error) {
            console.log('/api/match/accept failed with error: ' + error);
        }
    };
