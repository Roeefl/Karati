import React from 'react';
import { connect } from 'react-redux';
import { fetchMyProposals, setCurrentComponent } from '../../actions';
import * as errors from '../shared/errors';
import Message from '../shared/Message';
import Spinner from '../shared/Spinner';
import ProposalCard from './ProposalCard';

class MyProposals extends React.Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'My Proposals',
            secondary: 'View proposals that you made to or received from other users',
            icon: 'handshake outline'
        });

        this.props.fetchMyProposals();
    }

    renderContent() {
        if (!this.props.myProposals) {
            return (
                <Spinner message="Fetching Proposals..."/>
            );
        };

        if (this.props.myProposals.error) {
            return (
                <Message 
                    color='red'
                    lines={[
                        this.props.myProposals.error
                    ]} />
            );
        };

        if (this.props.myProposals.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NO_PROPOSALS
                    ]} />
            );
        };

        const proposals = this.props.myProposals.map( proposal => {
            return (
                <ProposalCard proposal={proposal} key={proposal.proposalId}/>
            );
        });

        return (
            <div className="proposal-grid ui divided items">
                {proposals}
            </div>
        );
    }

    render() {
        return (
            <div className="my-proposals ui raised container">
                <Message
                    color='violet'
                    lines={[
                        `You have ${this.props.myProposals.length || 0} proposals`
                    ]} />

                <div className="ui centered grid">
                    <div className="ui ten wide column">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData, 
        myProposals: state.myProposals
    }
};

export default connect(
    mapStateToProps,
    { fetchMyProposals, setCurrentComponent }
)(MyProposals);