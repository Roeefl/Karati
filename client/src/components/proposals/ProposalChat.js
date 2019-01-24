import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage, setCurrentComponent } from '../../actions';
import './ProposalChat.css';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatNewMessage from './chat/ChatNewMessage';

import Pusher from 'pusher-js';
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true; 

class ProposalChat extends React.Component {
    componentDidMount() {
        const pusher = new Pusher('300a43dcc40b1a52fa00', {
            cluster: 'eu',
            forceTLS: true
        });

        console.log(`${this.props.proposal.proposalId}`);
        // const channel = pusher.subscribe(`${this.props.proposal.proposalId}`);

        // channel.bind('newChatMessage', function(msg) {
        //     console.log('new msg from Pusher');

        // });
    }

    sendMessage = (message) => {
        this.props.sendChatMessage(this.props.proposal.proposalId, this.props.currUserId, message);
    }

    renderChat() {
        if (!this.props.proposal) {
            return (
                <div className="center aligned header chat-placeholder">
                    Select a proposal to view the chat
                </div>
            );
        }

        return (
            <div className="proposal-chat">
                <ChatHeader title={this.props.proposal.hisBook} status={this.props.proposal.status} />
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
    console.log(state);
    
    return {
        currUserId: state.userData._id,
        currentChat: state.currentChat
    }
};

export default connect(
    mapStateToProps,
    { sendChatMessage, setCurrentComponent }
)(ProposalChat);
