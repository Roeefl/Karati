import React from 'react';
import ProposalIcon from '../ProposalIcon';

class ChatHeader extends React.Component {
    renderCard() {
        return (
            <div className="ui centered card">
                <div className="content">
                    <div className="right floated meta">
                        {this.props.lastStatusDate}
                    </div>
                    <i className="user icon" /> {this.props.owner}
                </div>
                <div className="center aligned image">
                    <img src={this.props.src} className="book-cover" />
                </div>
                <div className="content">
                    <span className="right floated">
                        <ProposalIcon status={this.props.status} />
                    </span>
                    <i className="hand point left outline icon" /> { this.props.proposedByMe ? 'Offered by me' : `Offered by ${this.props.owner}` }
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="chat-header">
                {this.renderCard()}
            </div>
        );
    }
}

export default ChatHeader;
