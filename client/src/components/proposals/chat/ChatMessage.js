import React from 'react';

const ChatMessage = props => {
  return (
    <div className="comment chat-message">
      <div className="message-container">
        <div className="avatar">
          <i className="red user icon" />
        </div>
        <div className="content">
          <div className="author">{props.sender}</div>
          <div className="metadata">
            <span className="date">{props.whenSent}</span>
          </div>
          <div className="text">{props.message}</div>
        </div>
      </div>
      <div className="rect" />
    </div>
  );
};

export default ChatMessage;
