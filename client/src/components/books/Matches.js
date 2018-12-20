import Axios from 'axios';

import './Matches.css';

import React from 'react';
import { connect } from 'react-redux'   ;
import { updateBooks } from '../../actions';

import SwipeContainer from './SwipeContainer';
import BrowseContainer from './BrowseContainer';

import Spinner from '../shared/Spinner';
import Message from '../shared/Message';
import * as errors from '../shared/errors';

class Matches extends React.Component {
    componentDidMount() {
        this.props.updateBooks();
    }

    onLikeOrRejectBook = async (liked) => {
        let book = this.props.books[0];

        var data = {
            bookID: book.bookID,
            ownerID: book.ownerID
        };

        try {
            const apiURL = '/api/books/' + (liked ? 'liked' : 'rejected');
            const res = await Axios.put(apiURL, data);

            console.log(res);

            this.props.updateBooks();
        } catch(error) {
            console.log('onLikeOrRejectBook Axios post - failed with error: ' + error);
        }
    }

    renderContent() {
        console.log(this.props);

        if (!this.props.books) {
            return (
                <Spinner message="Fetching Books..."/>
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
                    swipeBook={this.onLikeOrRejectBook} />
            );
        };

        return (
            <SwipeContainer
                books={this.props.books}
                swipeBook={this.onLikeOrRejectBook} />
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
    console.log(state);

    return {
        auth: state.auth,
        books: state.books
    };
}

export default connect(
    mapStateToProps,
    { updateBooks }
)(Matches);