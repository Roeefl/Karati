import Axios from 'axios';

import './Matches.css';

import React from 'react';
import { connect } from 'react-redux'   ;
import { updateMatchResults } from '../../actions';

import SwipeContainer from './SwipeContainer';
import BrowseContainer from './BrowseContainer';

import Spinner from '../Spinner';

class Matches extends React.Component {
    state = {
        ready: false
    }

    fetchMatchResults = async () => {
        const res = await Axios.get('/api/matches');

        if (res.data.error !== 30) {
            this.props.updateMatchResults(res.data.matchResults);
            this.setState( {ready: true} );
        }
    }

    componentDidMount() {
        this.fetchMatchResults();
    }

    onLikeOrRejectBook = async (liked) => {
        let book = this.props.matchResults[0];

        var data = {
            bookID: book.bookID,
            like: liked,
            ownerID: book.ownerID
        };

        try {
            await Axios.post('/api/matches/swipe', data);
            this.fetchMatchResults();
        } catch(error) {
            console.log('api/matches/swipe failed with error: ' + error);
        }
    }

    renderContent() {
        if (this.state.ready) {
            if (this.props.matchResults.length > 0 ) {

                if (this.props.showGrid) {
                    return (
                        <BrowseContainer
                            matchResults={this.props.matchResults}
                            swipeBook={this.onLikeOrRejectBook} />
                    );
                }
                return (
                    <SwipeContainer
                        matchResults={this.props.matchResults}
                        swipeBook={this.onLikeOrRejectBook} />
                );
                
            }

            return (
                <div>
                    No Matches!
                </div>
            );
        }

        return (
            <Spinner message="Getting Matches..."/>
        );
    }

    render() {
        return (
            <div className="matches">
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        matchResults: state.matchResults
    };
}

export default connect(
    mapStateToProps,
    { updateMatchResults }
)(Matches);