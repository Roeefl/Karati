import Axios from 'axios';

import React from 'react';
import { connect } from 'react-redux';
import { updateMyMatches } from '../actions';

import MatchCard from './MatchCard';

class MyMatches extends React.Component {
    fetchMyMatches = async () => {
        try {
            const res = await Axios.get('/api/myMatches');
            console.log(res.data);

            if (res.data.error !== 30) {
                this.props.updateMyMatches(res.data.myMatches);
            }
        } catch(error) {
            console.log('/api/myMatches failed with error: ' + error);
        }
    }

    componentDidMount() {
        this.fetchMyMatches();
    }

    render() {
        const matches = this.props.myMatches.map( match => {
            return (
                <div className="match-card-container three wide column" key={match.id}>
                    <MatchCard matchData={match} />
                </div>
            );
        });

        return (
            <div className="my-matches ui container grid">
                <div className="my-matches-count ui segment">
                    You have {this.props.myMatches.length} Matches
                </div>
                <div className="my-matches-grid ui link cards grid">
                    {matches}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        myMatches: state.myMatches
    }
};

export default connect(
    mapStateToProps,
    { updateMyMatches }
)(MyMatches);