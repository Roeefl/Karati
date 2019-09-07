import React from 'react';
import { connect } from 'react-redux';
import { fetchMyMatches, setCurrentComponent, selectUserToShowMatchesWith } from '../../actions';

import MatchesWithUserCard from './MatchesWithUserCard';
import Message from '../shared/Message';
import Spinner from '../shared/Spinner';
import * as errors from '../shared/errors';
import * as icons from '../../config/icons';

class MyMatches extends React.Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'My Matches',
            secondary: 'View matches with users',
            icon: icons.MY_MATCHES
        });

        this.props.fetchMyMatches();
    }

    renderContent() {
        if (!this.props.myMatches) {
            return (
                <Spinner message="Fetching Matches..."/>
            );
        };

        if (this.props.myMatches.error) {
            return (
                <Message 
                    color='red'
                    lines={[
                        this.props.myMatches.error
                    ]} />
            );
        };

        if (this.props.myMatches.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NO_MATCHES
                    ]} />
            );
        };

        const matchesWithUsers = this.props.myMatches.filter( matchWithUser => matchWithUser.proposalInProgress === false).map( matchWithUser => {
            return (
                <div className="column" key={matchWithUser.ownerInfo._id} >
                    <MatchesWithUserCard data={matchWithUser} />
                </div>
            );
        });

        return (
            <div className="my-matches-grid ui four column grid">
                {matchesWithUsers}
            </div>
        );
    }
    
    render() {
        return (
            <div className="my-matches ui container">
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData, 
        myMatches: state.myMatches
    }
};

export default connect(
    mapStateToProps,
    { fetchMyMatches, setCurrentComponent, selectUserToShowMatchesWith }
)(MyMatches);
