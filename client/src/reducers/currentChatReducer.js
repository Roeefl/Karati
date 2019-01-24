import { UPDATE_CURRENT_CHAT } from '../actions/types';

export const currentChatReducer = (chat = false, action) => {
    if (action.type === UPDATE_CURRENT_CHAT) {
        return action.payload;
    }

    return chat;
};