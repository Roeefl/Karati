import Axios from 'axios';

import './Matches.css';

import React from 'react';
import { connect } from 'react-redux'   ;
import { updateBooks, fetchUser, setCurrentComponent } from '../../actions';

import SwipeContainer from './SwipeContainer';
import BrowseContainer from './BrowseContainer';

import Spinner from '../shared/Spinner';
import Message from '../shared/Message';
import * as errors from '../shared/errors';

class Matches extends React.Component {
    componentDidMount() {
        this.props.setCurrentComponent({
            primary: 'Matches',
            secondary: 'Browse matches around your location',
            icon: 'delicious'
        });

        this.props.updateBooks();
    }

    onSwipeBook = async (liked) => {
        let book = this.props.books[0];

        var data = {
            bookID: book.bookID,
            ownerID: book.ownerID,
            myUserID: this.props.userData._id
        };

        try {
            const apiURL = '/api/swipe/' + (liked ? 'liked' : 'rejected');
            await Axios.put(apiURL, data);

            // console.log(res);

            this.props.updateBooks();

            this.props.fetchUser();
        } catch(error) {
            console.log('onLikeOrRejectBook Axios post - failed with error: ' + error);
        }
    }

    renderContent() {
        // console.log(this.props);

        if (!this.props.books) {
            return (
                <Spinner message="Fetching Books..."/>
            );
        };

        if (!this.props.userData) {
            return (
                <Message 
                    color='red'
                    lines={[
                        errors.NOT_LOGGED_IN
                    ]} />
            );
        };

        if (this.props.books.length <= 0 ) {
            return (
                <Message 
                    color='red'
                    lines={[
                        'No books available nearby at the moment. Please change search filters to get more results.'
                    ]} />
            );
        };

        if (this.props.showGrid) {
            return (
                <BrowseContainer
                    books={this.props.books}
                    swipeBook={this.onSwipeBook} />
            );
        };

        return (
            <SwipeContainer
                books={this.props.books}
                swipeBook={this.onSwipeBook} />
        );
    }

    render() {
        return (
            <div className="matches ui container">
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log(state);

    return {
        userData: state.userData,
        books: state.books
    };
}

export default connect(
    mapStateToProps,
    { updateBooks, fetchUser, setCurrentComponent}
)(Matches);