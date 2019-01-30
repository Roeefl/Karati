import Axios from 'axios';

import {
    UPDATE_MY_PROPOSALS,
    PROPOSE_SWAP,
    UPDATE_MY_MATCHES,
    UPDATE_CURRENT_PROPOSAL
 } from './types';

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

            dispatch({
                type: UPDATE_CURRENT_PROPOSAL,
                payload: res.data.proposal || null
            });
        } catch (error) {
            console.log('POST /api/proposal/chat failed with error: ' + error);
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
        const matchData = {
            matchId
        };

        try {
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
