import React from 'react';
import ChatMessage from './ChatMessage';

class ChatMessages extends React.Component {
    renderChatContent() {
        if (!this.props.chat) {
            return (
                <div>Loading...</div>
            );
        }

        const chatContent = this.props.chat.map( chatMsg => {
            // console.log(chatMsg);
            
            return (
                <ChatMessage
                    key={chatMsg.whenSent}
                    sender={chatMsg.senderName}
                    message={chatMsg.message}
                    whenSent={chatMsg.whenSent}
                />
            )
        });

        return (
            <div className="ui container">
                {chatContent}
            </div>
        );
    }

    render() {
        return (
            <div className="chat-messages ui comments">
                <h3 className="ui dividing header">
                    Chat
                </h3>

                {this.renderChatContent()}
            </div>
        );
    }
}

export default ChatMessages;