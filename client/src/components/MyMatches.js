import React from 'react';
import { connect } from 'react-redux';
import { fetchMyMatches } from '../actions';

import MatchCard from './MatchCard';
import Message from './shared/Message';
import Spinner from './shared/Spinner';
import * as errors from './shared/errors';

class MyMatches extends React.Component {
    componentDidMount() {
        this.props.fetchMyMatches();
    }

    renderContent() {
        if (!this.props.myMatches) {
            return (
                <Spinner message="Fetching Matches..."/>
            );
        };

        if (!this.props.auth) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NOT_LOGGED_IN
                    ]} />
            );
        };

        if (this.props.myMatches.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'You do not have any matches yet. Add more books to your shelf to increase your odds!'
                    ]} />
            );
        };

        const matches = this.props.myMatches.map( match => {
            return (
                <div className="match-card-container eight wide column" key={match.id}>
                    <MatchCard matchData={match} />
                </div>
            );
        });

        return (
            <div className="my-matches-grid ui link cards grid">
                {matches}
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
        auth: state.auth, 
        myMatches: state.myMatches
    }
};

export default connect(
    mapStateToProps,
    { fetchMyMatches }
)(MyMatches);