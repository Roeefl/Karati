import React from 'react';

class ChatHeader extends React.Component {
    render() {
        return (
            <div className="chat-header">
                {this.props.title}

                <div className="ok">
                    Status: {this.props.status}
                </div>
            </div>
        );
    }
}

export default ChatHeader;
