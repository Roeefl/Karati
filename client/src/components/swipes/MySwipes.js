import { connect } from 'react-redux';

import { fetchMySwipeHistory, setCurrentComponent } from '../../actions';

import React from 'react';

import SwipeCard from './SwipeCard';

import Message from '../shared/Message';
import Spinner from '../shared/Spinner';
import * as errors from '../shared/errors';

class MySwipes extends React.Component {
    componentDidMount() {
        this.props.fetchMySwipeHistory();

        this.props.setCurrentComponent({
            primary: 'Your Swipe History',
            secondary: 'View your previous swipes',
            icon: 'thumbs up outline'
        });
    }

    renderContent() {
        if (!this.props.userData) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NOT_LOGGED_IN
                    ]} />
            );
        };
        
        if (!this.props.swipeHistory) {
            return (
                <Spinner message="Fetching your swipe history..."/>
            );
        };

        
        const swipes = this.props.swipeHistory.map( swipe => {
            console.log(swipe);
            return (
                <SwipeCard swipe={swipe} key={swipe._id}/>
            );
        });

        return (
            <div className="swipes-grid ui divided items">
                {swipes}
            </div>
        );
    }

    render() {
        return (
            <div className="my-swipes ui container">
                <Message
                    color='violet'
                    lines={[
                        `You've swiped on ${this.props.swipeHistory.length || 0} books so far`
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
        swipeHistory: state.swipeHistory
    }
};

export default connect(
    mapStateToProps,
    { fetchMySwipeHistory, setCurrentComponent }
)(MySwipes);