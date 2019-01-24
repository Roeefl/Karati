import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage, refreshChat, setCurrentComponent } from '../../actions';
import './ProposalChat.css';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatNewMessage from './chat/ChatNewMessage';

import Pusher from 'pusher-js';
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true; 

const pusher = new Pusher('300a43dcc40b1a52fa00', {
    cluster: 'eu',
    forceTLS: true
});

class ProposalChat extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.proposal) {
            // console.log(`channel name: ${nextProps.proposal.proposalId}`);
            const channel = pusher.subscribe(`${nextProps.proposal.proposalId}`);

            channel.bind('newChatMessage', (data) => {
                console.log(`new msg from Pusher: ${data.msg}`);
                nextProps.refreshChat(nextProps.proposal.proposalId);
            });
        }
    }

    sendMessage = (message) => {
        this.props.sendChatMessage(this.props.proposal.proposalId, this.props.currUserId, message);
    }

    renderChat() {
        if (!this.props.proposal) {
            return (
                <div className="center aligned header proposal-chat">
                    Select a proposal to view the chat
                </div>
            );
        }

        return (
            <div className="proposal-chat">
                <ChatHeader
                    title={this.props.proposal.hisBook}
                    status={this.props.proposal.status}
                    owner={this.props.proposal.owner}
                    proposedByMe={this.props.proposal.proposedByMe}
                    proposedOn={this.props.proposal.lastStatusDate}
                    src={this.props.proposal.hisBookImageURL}
                />

                <ChatMessages chat={this.props.currentChat} />
                <ChatNewMessage sendMsg={this.sendMessage} />
            </div>
        )
    }

    render() {
        return (
            <div className="proposal-chat-container">
                {this.renderChat()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currUserId: state.userData._id,
        currentChat: state.currentChat
    }
};

export default connect(
    mapStateToProps,
    { sendChatMessage, refreshChat, setCurrentComponent }
)(ProposalChat);
