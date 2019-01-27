import React from 'react';
import { connect } from 'react-redux';
import { sendChatMessage, reloadProposal, setCurrentComponent } from '../../actions';
import './ProposalChat.css';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatNewMessage from './chat/ChatNewMessage';

class ProposalChat extends React.Component {
    constructor(props) {
        super(props);
        this.channel = null;
     }

    sendMessage = (message) => {
        this.props.sendChatMessage(this.props.proposal.proposalId, this.props.currUserId, message);
    }

    connectToPusher = () => {
        if (this.channel)
            return;

        if (!this.props.pusher)
            return;

        // console.log(`channel name: ${nextProps.proposal.proposalId}`);
        this.channel = this.props.pusher.subscribe(`${this.props.proposal.proposalId}`);

        this.channel.bind('newChatMsg', (data) => {
            console.log(`new msg from Pusher: ${data.message}`);
            this.props.reloadProposal(this.props.proposal.proposalId);
        });
    }

    renderChat() {
        if (!this.props.proposal) {
            return (
                <div className="center aligned header proposal-chat">
                    Select a proposal to view the chat
                </div>
            );
        }

        this.connectToPusher();

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

                <ChatMessages chat={this.props.proposal.chat} />
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
        pusher: state.pusher,
        currUserId: state.userData._id,
        proposal: state.currentProposal
    }
};

export default connect(
    mapStateToProps,
    { sendChatMessage, reloadProposal, setCurrentComponent }
)(ProposalChat);
